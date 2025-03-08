import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MinusCircle, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, Form, Input as AntInput, InputNumber, Select as AntSelect, message, Spin, Switch, Upload } from "antd";
import { createProduct } from "@/lib/api/product-api";
import { getCategories } from "@/lib/api/category-api";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";

const ToolPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isCustomizable, setIsCustomizable] = useState(false); // Theo dõi trạng thái Switch

  const uploadFile = async (file: File) => {
    try {
      console.log("🔹 Uploading to BE:", file.name);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://wooly-5dfu.onrender.com/image/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      console.log("📥 Raw response from /image/upload:", text);

      let result;
      try {
        result = JSON.parse(text);
        console.log("📥 Parsed JSON response:", result);

        if (result.success) {
          const imageUrl = result.data;
          console.log("✅ Image URL from BE:", imageUrl);
          return imageUrl;
        } else {
          throw new Error(result.error || "Upload failed");
        }
      } catch (jsonError) {
        console.log("📥 Response is not JSON, assuming it's a URL:", text);
        if (text.startsWith("http")) {
          return text;
        } else {
          throw new Error("Unexpected response format: " + text);
        }
      }
    } catch (error) {
      console.error("❌ Upload to BE failed:", error.message || error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        message.error("Lỗi khi tải danh mục!");
      }
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageFile(null);
    setImageUrl("");
    setIsCustomizable(false);
  };

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      console.log("📸 Selected file:", file);
      setImageFile(file);
    } else {
      console.log("📸 No file selected or file removed");
      setImageFile(null);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("📝 Form values:", values);

      if (!values.categoryID) {
        message.error("Danh mục không được để trống!");
        return;
      }

      setLoading(true);

      let imageUrl = "";

      if (imageFile) {
        console.log("🟢 Uploading file to BE:", imageFile.name);
        const uploadedUrl = await uploadFile(imageFile);

        if (!uploadedUrl) {
          message.error("❌ Lỗi khi upload ảnh lên server!");
          setLoading(false);
          return;
        }

        imageUrl = uploadedUrl;
        console.log("🔗 Image URL from BE:", imageUrl);
      } else {
        message.error("Vui lòng chọn ảnh sản phẩm!");
        setLoading(false);
        return;
      }

      const productData = {
        productName: values.productName,
        description: values.description,
        price: values.price.toString(),
        stockQuantity: values.stockQuantity.toString(),
        categoryID: values.categoryID.toString(),
        imageUrl: imageUrl,
        isCustomizable: values.isCustomizable || false,
        partNames: values.isCustomizable && values.partNames ? values.partNames : [], // Gửi partNames nếu isCustomizable là true
      };
      console.log("📤 Sending data to createProduct:", productData);

      const response = await createProduct(productData);
      console.log("📥 Server response from createProduct:", response);

      if (response.success) {
        toast.success("Thêm sản phẩm thành công!");
        setIsModalOpen(false);
        form.resetFields();
        setImageFile(null);
        setImageUrl("");
        setIsCustomizable(false);
        window.location.reload();
      } else {
        message.error(response.error?.error || "Có lỗi xảy ra khi tạo sản phẩm!");
      }
    } catch (error) {
      console.error("❌ Error in handleOk:", error);
      message.error("Có lỗi xảy ra khi xử lý!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 pb-5 gap-5">
      <div className="col-span-4 flex gap-3">
        <Input placeholder="Nhập để tìm kiếm" />
        <Button>
          <Search />
        </Button>
      </div>

      <div className="col-span-3">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="*">Tất cả</SelectItem>
            <SelectItem value="In Stock">Còn hàng</SelectItem>
            <SelectItem value="Out of Stock">Hết hàng</SelectItem>
            <SelectItem value="In Transit">Đang vận chuyển</SelectItem>
            <SelectItem value="Pending">Đợi duyệt</SelectItem>
            <SelectItem value="Discontinued">Ngừng kinh doanh</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-5 flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-600 flex gap-3 items-center" onClick={showModal}>
          <Plus />
          Tạo mới
        </Button>
      </div>

      <Modal
        title="Thêm sản phẩm mới"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="productName"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <AntInput />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <AntInput.TextArea />
          </Form.Item>

          <Form.Item label="Giá bán (VNĐ)" name="price" rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}>
            <InputNumber
              className="w-full"
              min={0}
              formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫" : "")}
              parser={(value) => value.replace(/\D/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="Số lượng tồn kho"
            name="stockQuantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="categoryID"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            {loadingCategories ? (
              <Spin />
            ) : (
              <AntSelect placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <AntSelect.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </AntSelect.Option>
                ))}
              </AntSelect>
            )}
          </Form.Item>

          <Form.Item label="Ảnh sản phẩm" required>
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleFileChange}
              onRemove={() => setImageFile(null)}
              fileList={imageFile ? [{ uid: "-1", name: imageFile.name, status: "done" }] : []}
              showUploadList={true}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          {imageFile && (
            <div className="mt-3">
              <p>Ảnh xem trước:</p>
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="max-w-xs rounded shadow" />
            </div>
          )}

          <Form.Item label="Có thể tùy chỉnh" name="isCustomizable" valuePropName="checked">
            <Switch onChange={(checked) => setIsCustomizable(checked)} />
          </Form.Item>

          {/* Hiển thị các trường partNames và partColors khi isCustomizable là true */}
          {isCustomizable && (
            <Form.List name="partNames">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ display: "flex", flexDirection: "column", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Form.Item
                          {...restField}
                          name={[name, "partName"]}
                          rules={[{ required: true, message: "Vui lòng nhập tên bộ phận!" }]}
                          style={{ flex: 1 }}
                        >
                          <AntInput placeholder="Tên bộ phận" />
                        </Form.Item>
                        <Button
                          className="bg-red-600 hover:bg-red-600"
                          type="dashed"
                          onClick={() => remove(name)}
                          style={{ marginBottom: 24 }}
                        >
                          xóa
                        </Button>
                      </div>

                      <Form.List name={[name, "partColors"]}>
                        {(colorFields, { add: addColor, remove: removeColor }) => (
                          <>
                            {colorFields.map(({ key: colorKey, name: colorName, ...restColorField }) => (
                              <div
                                key={colorKey}
                                style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 24 }}
                              >
                                <Form.Item
                                  {...restColorField}
                                  name={[colorName, "partColor"]}
                                  rules={[{ required: true, message: "Vui lòng nhập màu sắc!" }]}
                                  style={{ flex: 1 }}
                                >
                                  <AntInput placeholder="Màu sắc" />
                                </Form.Item>
                                <Button type="dashed" onClick={() => removeColor(colorName)} icon={<Plus />}>
                                  xóa
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="dashed"
                              onClick={() => addColor()}
                              icon={<Plus />}
                              style={{ width: "60%", marginLeft: 24, marginTop: 8 }}
                            >
                              Thêm màu sắc
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<Plus />} style={{ width: "100%", marginTop: 16 }}>
                    Thêm bộ phận
                  </Button>
                </>
              )}
            </Form.List>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ToolPanel;
