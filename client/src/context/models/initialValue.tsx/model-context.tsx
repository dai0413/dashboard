export const getDefaultValue = (initialFormData: any) => ({
  items: [],
  selected: null,
  setSelected: () => {},

  formData: initialFormData,
  handleFormData: () => {},
  resetFormData: () => {},

  formSteps: [],
  startEdit: () => {},
  // setFormSteps: () => {},

  createItem: async () => {},
  readItem: async () => {},
  readItems: async () => {},
  updateItem: async () => {},
  deleteItem: async () => {},

  getDiffKeys: () => [],
});
