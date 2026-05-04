type ArrayFieldWrapperProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  renderAdd?: () => React.ReactNode;
};

export const ArrayFieldWrapper = <T,>({
  items,
  renderItem,
  renderAdd,
}: ArrayFieldWrapperProps<T>) => {
  return (
    <>
      {items.map((item, index) => renderItem(item, index))}
      {renderAdd && renderAdd()}
    </>
  );
};
