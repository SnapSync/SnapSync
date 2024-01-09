import { Spinner } from "@gluestack-ui/themed";
import React from "react";

type Props = {
  isFetchingNextPage: boolean;
};

const ListFooterComponent = ({ isFetchingNextPage }: Props) => {
  if (!isFetchingNextPage) return null;

  return <Spinner size="small" />;
};

export default ListFooterComponent;
