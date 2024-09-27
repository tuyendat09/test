import { useCallback, useEffect, useState } from "react";
import { Product } from "@/types/Product";
import {
  useGetProductsQuery,
  useLazyGetProductsQuery,
} from "@/libs/features/services/product";

interface UseGetProductProps {
  filterCategory: string[];
  filterSubCategory: string[];
  filterAnimalType?: string;
}

export default function useGetProductShop({
  filterCategory,
  filterSubCategory,
  filterAnimalType,
}: UseGetProductProps) {
  const { data: PaginateProduct } = useGetProductsQuery({
    productCategory: filterCategory,
    productSubCategory: filterSubCategory,
    limit: 3,
    page: 1,
  });

  const [triggerGetProducts, { data: lazyData, isFetching, isError }] =
    useLazyGetProductsQuery();

  const [products, setListProduct] = useState<Product[]>([]);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  console.log(paginatedProducts);

  useEffect(() => {
    if (PaginateProduct?.products) {
      setListProduct(PaginateProduct.products);
      setPaginatedProducts(PaginateProduct.products);
      setTotalPages(PaginateProduct.pagination.totalPages);
      setCurrPage(1); // Reset current page to 1 when filters change
    }
  }, [PaginateProduct]);

  const handleFetchMore = useCallback(
    async (limit: number) => {
      if (currPage < totalPages) {
        const nextPage = currPage + 1;

        try {
          const data = await triggerGetProducts({
            productCategory: filterCategory,
            productSubCategory: filterSubCategory,
            page: nextPage,
            limit: limit,
          }).unwrap();

          if (data?.products) {
            setListProduct((prevProducts) => [
              ...prevProducts,
              ...data.products,
            ]);

            setPaginatedProducts((prevProducts) => [
              ...prevProducts,
              ...data.products,
            ]);

            setCurrPage(nextPage);
          }
        } catch (error) {
          console.error("Failed to fetch more products:", error);
        }
      } else {
        alert("No more products to load.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currPage,
      totalPages,
      filterCategory,
      filterSubCategory,
      filterAnimalType,
      triggerGetProducts, // Include in dependencies
    ],
  );

  const handleQueryProduct = useCallback(
    async (productName: string) => {
      if (productName.trim() === "") {
        setListProduct(paginatedProducts);
        return;
      }

      // Fetch products matching the search query
      const data = await triggerGetProducts({
        productName: productName,
        limit: 1000,
      }).unwrap();

      if (data?.products) {
        setListProduct(data.products);
      } else {
        setListProduct([]);
      }
    },
    [paginatedProducts, triggerGetProducts],
  );

  return {
    products,
    totalPages,
    currPage,
    handleFetchMore,
    handleQueryProduct,
  };
}
