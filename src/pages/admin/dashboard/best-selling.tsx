import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { getBestSeller } from "@/lib/api/statics-api";
import { Product } from "@/types/product";
import Loader from "@/components/loader";

const BestSelling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await getBestSeller();
        console.log("Response từ API: ", response);

        if (response.success && Array.isArray(response.data?.data)) {
          setProducts(response.data.data.slice(0, 6));
        } else {
          console.error("Dữ liệu trả về không hợp lệ: ", response);
        }
      } catch (error) {
        console.error("Lỗi khi fetch API: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  if (loading)
    return (
      <div>
        {" "}
        <Loader />
      </div>
    );

  return (
    <div className="col-span-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sản phẩm bán chạy</CardTitle>
          <CardDescription>Top 6 sản phẩm bán chạy nhất.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            {products.map((product) => (
              <div className="grid grid-cols-5 mb-5 gap-3" key={product.productId}>
                <AspectRatio ratio={1} className="rounded-lg overflow-hidden drop-shadow">
                  <img src={product.productPicture} alt={product.productName} />
                </AspectRatio>
                <div className="col-span-4 text-sm flex flex-col justify-between">
                  <h4 className="font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                    {product.productName}
                  </h4>
                  <div className="flex justify-between">
                    <p className="text-zinc-500">Giá: {product.productPrice.toLocaleString()}đ</p>
                    <Badge className="border-orange-600 border text-orange-600 bg-orange-100">
                      {product.totalSold ?? 0} Đơn
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BestSelling;
