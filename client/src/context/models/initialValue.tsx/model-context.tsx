export const getDefaultValue = (initialFormData: any) => ({
  items: [],
  selected: null,
  setSelected: () => {},

  formData: initialFormData,
  handleFormData: () => {},
  resetFormData: () => {},

  formSteps: [],
  startNewData: () => {},
  startEdit: () => {},
  // setFormSteps: () => {},

  createItem: async () => {},
  readItem: async () => {},
  readItems: async () => {},
  updateItem: async () => {},
  deleteItem: async () => {},

  getDiffKeys: () => [],
  isLoading: false,

  filterableField: [],
  sortableField: [],
});
