import React, { useEffect, useState } from "react";
import { Form, Input, Button, InputNumber, message, Upload, Select, Switch } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct, uploadProductImage } from "../../../lib/api/product-api";
import { Product } from "@/types/product";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { getCategories } from "../../../lib/api/category-api";

const { Option } = Select;

// Đầu tiên, bạn cần cập nhật interface Product trong file types/product.ts
// interface Product {
//   productID: number;
//   description: string;
//   imageUrl: string;
//   productName: string;
//   price: number;
//   stockQuantity: number;
//   categoryID: number;
//   partNames: any[];
//   isCustomizable: boolean; // Thêm field này
// }

const UpdateProductPage: React.FC = () => {
  const [form] = Form.useForm();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ categoryID: number; categoryName: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log("Danh sách danh mục từ API:", response);
        if (response.success && response.data) {
          const mappedCategories = response.data.map((category: any) => ({
            categoryID: category.categoryID || category.id,
            categoryName: category.categoryName || category.name,
          }));
          setCategories(mappedCategories);
        } else {
          message.error("Không thể tải danh sách danh mục!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        message.error("Lỗi khi tải danh sách danh mục!");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        message.error("Không tìm thấy ID sản phẩm trong URL!");
        return;
      }

      try {
        setLoading(true);
        const response = await getProductById(Number(productId));
        console.log("Phản hồi từ API getProductById:", response);

        if (response.success && response.data) {
          const productData: Product = {
            productID: response.data.productID || response.data.productId || 0,
            description: response.data.description || "",
            imageUrl: response.data.imageUrl || "",
            productName: response.data.productName || "",
            price: response.data.price || 0,
            stockQuantity: response.data.stockQuantity || 0,
            categoryID: response.data.categoryID || response.data.category || 0,
            partNames: response.data.partNames || [],
            isCustomizable: response.data.isCustomizable || false, // Thêm field từ API
          };

          form.setFieldsValue(productData);

          if (response.data.imageUrl) {
            setFileList([
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: response.data.imageUrl,
              },
            ]);
          }
          message.success("Đã tải dữ liệu sản phẩm thành công!");
        } else {
          message.error("Không thể tải dữ liệu sản phẩm: " + (response.error || "Lỗi không xác định"));
        }
      } catch (error) {
        message.error("Lỗi khi gọi API lấy dữ liệu sản phẩm!");
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, form]);

  const onFinish = async (values: Product) => {
    setLoading(true);
    try {
      let finalImageUrl = fileList.length > 0 ? fileList[0].url : "";

      if (fileList.length > 0 && fileList[0].originFileObj) {
        finalImageUrl = await uploadProductImage(fileList[0].originFileObj);
      }

      const productData: Product = {
        ...values,
        imageUrl: finalImageUrl,
        productID: Number(productId),
        categoryID: Number(values.categoryID),
        stockQuantity: Number(values.stockQuantity),
        isCustomizable: values.isCustomizable, // Thêm field vào data gửi lên
        partNames: values.partNames.map((part: any) => ({
          ...part,
          partID: Number(part.partID),
          partColors: part.partColors.map((color: any) => ({
            ...color,
            colorID: Number(color.colorID),
          })),
        })),
      };

      if (productId) {
        const response = await updateProduct(Number(productId), productData);
        if (response.success) {
          message.success("Cập nhật sản phẩm thành công!");
          navigate("/product");
        } else {
          message.error("Không thể cập nhật sản phẩm!");
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật sản phẩm!");
      console.error("Lỗi khi cập nhật:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cập nhật sản phẩm</h1>
      <Form form={form} layout="vertical" onFinish={onFinish} className="max-w-4xl">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item name="price" label="Giá bán" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
            <InputNumber min={0} className="w-full" placeholder="Nhập giá bán" />
          </Form.Item>

          <Form.Item
            name="categoryID"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục" loading={categories.length === 0}>
              {categories.map((category) => (
                <Option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="stockQuantity"
            label="Số lượng tồn kho"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho!" }]}
          >
            <InputNumber min={0} className="w-full" placeholder="Nhập số lượng tồn kho" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}>
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item label="Hình ảnh sản phẩm">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>

          {/* Thêm field isCustomizable */}
          <Form.Item name="isCustomizable" label="Có thể tùy chỉnh" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
        </div>

        <Form.List name="partNames">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className="grid grid-cols-1 gap-4 mt-4 border border-gray-200 p-6 rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <Form.Item
                      {...restField}
                      name={[name, "partName"]}
                      label={<span className="font-semibold text-gray-700">Tên bộ phận</span>}
                      rules={[{ required: true, message: "Vui lòng nhập tên bộ phận!" }]}
                      className="w-full"
                    >
                      <Input placeholder="Nhập tên bộ phận" className="rounded-md" />
                    </Form.Item>
                  </div>

                  <div className="ml-4">
                    <h4 className="font-medium text-gray-600 mb-2">Màu sắc</h4>
                    <Form.List name={[name, "partColors"]}>
                      {(colorFields, { add: addColor, remove: removeColor }) => (
                        <div className="space-y-3">
                          {colorFields.map(({ key: colorKey, name: colorName, ...colorRestField }) => (
                            <div
                              key={colorKey}
                              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-white p-3 rounded-md shadow-sm"
                            >
                              <Form.Item
                                {...colorRestField}
                                name={[colorName, "partColor"]}
                                label={<span className="text-gray-600">Tên màu</span>}
                                rules={[{ required: true, message: "Vui lòng nhập màu!" }]}
                                className="col-span-1 md:col-span-2 mb-0"
                              >
                                <Input placeholder="Nhập màu sắc (ví dụ: black, green)" className="rounded-md" />
                              </Form.Item>

                              <div className="flex items-center space-x-2">
                                <Form.Item
                                  shouldUpdate={(prevValues, currentValues) =>
                                    prevValues?.partNames?.[name]?.partColors?.[colorName]?.partColor !==
                                    currentValues?.partNames?.[name]?.partColors?.[colorName]?.partColor
                                  }
                                  noStyle
                                >
                                  {({ getFieldValue }) => {
                                    const colorValue =
                                      getFieldValue(["partNames", name, "partColors", colorName, "partColor"]) || "";
                                    console.log(`Color value for part ${name}, color ${colorName}:`, colorValue);

                                    if (!colorValue) {
                                      return (
                                        <div className="flex items-center space-x-2">
                                          <Button danger onClick={() => removeColor(colorName)} className="ml-2">
                                            Xóa màu
                                          </Button>
                                        </div>
                                      );
                                    }

                                    const trimmedColorValue = colorValue.trim().toLowerCase();
                                    const textColor = ["black", "blue", "red", "purple", "brown"].includes(
                                      trimmedColorValue
                                    )
                                      ? "#FFF"
                                      : "#000";

                                    return (
                                      <div className="flex items-center space-x-2">
                                        <div
                                          className="w-6 h-6 rounded-full border border-gray-300"
                                          style={{ backgroundColor: trimmedColorValue }}
                                        />
                                        <span style={{ color: textColor }}>{trimmedColorValue}</span>
                                        <Button danger onClick={() => removeColor(colorName)} className="ml-2">
                                          Xóa màu
                                        </Button>
                                      </div>
                                    );
                                  }}
                                </Form.Item>
                              </div>
                            </div>
                          ))}
                          <Button
                            onClick={() => addColor()}
                            className="mt-2 bg-green-500 text-white hover:bg-green-600"
                            icon={<PlusOutlined />}
                          >
                            Thêm màu
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </div>

                  <Button danger onClick={() => remove(name)} className="mt-4 w-full md:w-auto">
                    Xóa bộ phận
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => add()}
                className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
                icon={<PlusOutlined />}
              >
                Thêm bộ phận
              </Button>
            </div>
          )}
        </Form.List>

        <Form.Item>
          <div className="flex gap-4 mt-6">
            <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-500">
              Cập nhật sản phẩm
            </Button>
            <Button onClick={() => navigate("/product")} disabled={loading}>
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateProductPage;
