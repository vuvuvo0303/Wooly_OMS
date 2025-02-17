import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import len1 from "@/assets/images/len1.jpg";
import len2 from "@/assets/images/len2.jpg";
import len3 from "@/assets/images/len3.jpeg";
import len4 from "@/assets/images/len4.jpg";
import len5 from "@/assets/images/len5.jpeg";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
const thisMonth = new Date().getMonth() + 1;
const bestSellingProducts = [
  {
    id: 1,
    productName:
      "Móc khóa len",
    image: len1,
    numOfOrders: 12,
    percentage: 8.3,
  },
  {
    id: 2,
    productName:
      "Thú len bông",
    image: len2,
    numOfOrders: 10,
    percentage: 6.2,
  },
  {
    id: 3,
    productName:
      "Hoa len",
    image: len3,
    numOfOrders: 8,
    percentage: 3.12,
  },
  {
    id: 4,
    productName:
      "Nón len",
    image: len4,
    numOfOrders: 8,
    percentage: 3.12,
  },
  {
    id: 5,
    productName:
      "Trái cây len",
    image: len5,
    numOfOrders: 6,
    percentage: 2.6,
  },
];
const BestSelling = () => {
  const [month, setMonth] = useState<string>(
    (thisMonth == 1 ? 12 : thisMonth - 1).toString()
  );
  return (
    <div className="col-span-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sản phẩm bán chạy</CardTitle>
          <CardDescription>
            {/* <Select value={month} onValueChange={(value) => setMonth(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => {
                  return (
                    <SelectItem value={value.toString()} key={value}>
                      Tháng {value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select> */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            {bestSellingProducts.map((product, index: number) => {
              return (
                <div className="grid grid-cols-5 mb-5 gap-3" key={index}>
                  <AspectRatio
                    ratio={1}
                    className="rounded-lg overflow-hidden drop-shadow"
                  >
                    <img src={product.image} alt="" />
                  </AspectRatio>
                  <div className="col-span-4 text-sm flex flex-col justify-between">
                    <h4 className="font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                      {product.productName}
                    </h4>
                    <div className="flex justify-between">
                      <p className="text-zinc-500">
                        Đơn đặt: {product.numOfOrders}
                      </p>
                      <Badge
                        className="border-orange-600 border text-orange-600 bg-orange-100"
                        variant={"outline"}
                      >
                        {product.percentage}%
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
        {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
      </Card>
    </div>
  );
};

export default BestSelling;
