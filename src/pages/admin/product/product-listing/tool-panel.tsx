import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, Form, Input as AntInput, InputNumber, Select as AntSelect, message, Spin, Switch } from "antd";
import { createProduct } from "@/lib/api/product-api";
import { getCategories } from "@/lib/api/category-api";
import { toast } from "react-toastify";

const ToolPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 🟢 Fetch danh mục khi component mount
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

  // 🟢 Mở modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // 🔴 Hủy modal và reset form
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // 🟢 Xử lý gửi form
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      console.log("🔹 Dữ liệu gửi đi:", values); // Debug xem có đủ trường không

      if (!values.categoryID) {
        message.error("Danh mục không được để trống!");
        return;
      }

      setLoading(true);

      const response = await createProduct(values); // 🟢 Gửi API

      if (response.success) {
        toast.success("Thêm sản phẩm thành công!");
        setIsModalOpen(false);
        form.resetFields();
        window.location.reload();
      } else {
        message.error(response.error || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 pb-5 gap-5">
      {/* Ô tìm kiếm */}
      <div className="col-span-4 flex gap-3">
        <Input placeholder="Nhập để tìm kiếm" />
        <Button>
          <Search />
        </Button>
      </div>

      {/* Chọn trạng thái */}
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

      {/* Nút tạo mới */}
      <div className="col-span-5 flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-600 flex gap-3 items-center" onClick={showModal}>
          <Plus />
          Tạo mới
        </Button>
      </div>

      {/* Modal thêm sản phẩm */}
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
          <Form.Item label="Tên sản phẩm" name="productName" rules={[{ required: true }]}>
            <AntInput />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <AntInput.TextArea />
          </Form.Item>

          <Form.Item label="Giá bán (VNĐ)" name="price" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Số lượng tồn kho" name="stockQuantity" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Chiều cao (cm)" name="sizeHeight" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Chiều ngang (cm)" name="sizeHorizontal" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Danh mục" name="categoryID" rules={[{ required: true }]}>
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

          <Form.Item label="Ảnh sản phẩm (URL)" name="imageUrl" rules={[{ required: true, type: "url" }]}>
            <AntInput />
          </Form.Item>

          <Form.Item label="Có thể tùy chỉnh" name="isCustomizable" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.List name="partNames">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="border p-3 mb-2 rounded-md">
                    <Form.Item
                      {...restField}
                      label="Tên bộ phận"
                      name={[name, "partName"]}
                      rules={[{ required: true, message: "Nhập tên bộ phận!" }]}
                    >
                      <AntInput placeholder="Nhập tên bộ phận" />
                    </Form.Item>

                    <Form.List name={[name, "partColors"]}>
                      {(colorFields, { add: addColor, remove: removeColor }) => (
                        <div className="pl-4">
                          {colorFields.map(({ key: colorKey, name: colorName, ...restColorField }) => (
                            <Form.Item
                              key={colorKey}
                              {...restColorField}
                              label="Màu sắc"
                              name={[colorName, "partColor"]}
                              rules={[{ required: true, message: "Nhập màu sắc!" }]}
                            >
                              <AntInput placeholder="Nhập màu sắc" />
                            </Form.Item>
                          ))}
                          <Button className="mb-7" onClick={() => addColor()}>Thêm màu sắc</Button>
                        </div>
                      )}
                    </Form.List>

                    <Button    onClick={() => remove(name)}>
                      Xóa bộ phận
                    </Button>
                  </div>
                ))}
                <Button onClick={() => add()}>
                  Thêm bộ phận
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ToolPanel;
