import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Button, Form, Modal } from "antd";
import { useState } from "react";
import { Category } from "@/types/category";
import { createCategory } from "@/lib/api/category-api";

const ToolsPanel = ({ fetchCategories }: { fetchCategories: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Category[]>([]);

  const [form] = Form.useForm();
  const handleCreateCategory = async (value: { name: string }) => {
    try {
      const response = await createCategory(value);
      if (response.success) {
        setData([...data, response.data]);
        form.resetFields();
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (error) {
      console.error("Lỗi tạo danh mục:", error);
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
      <div className="col-span-3"></div>
      <div className="col-span-3"></div>
      <div className="col-span-2 flex justify-end">
        <Button type="primary" className=" py-4 " onClick={() => setIsModalOpen(true)}>
          <Plus />
          Tạo mới
        </Button>
      </div>
      <Modal title="Thêm mới loại sản phẩm len" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form layout="vertical" form={form} onFinish={handleCreateCategory}>
          <Form.Item
            label="Tên loại"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên loại sản phẩm len" }]}
          >
            <Input placeholder="nhập tên loại sản phẩm len" />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button htmlType="submit" type="primary">
              Thêm
            </Button>
            <Button type="primary" danger onClick={() => setIsModalOpen(false)}>
              Đóng
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ToolsPanel;
