type AccentSectionProps = {
  primaryColor?: string;
  children: React.ReactNode;
};

const AccentSection = ({ primaryColor, children }: AccentSectionProps) => {
  return (
    <section
      className="space-y-4 rounded-xl border border-gray-200 border-l-4 bg-white p-4 shadow-sm"
      style={{
        borderLeftColor: primaryColor || "#E5E7EB",
      }}
    >
      {children}
    </section>
  );
};

export default AccentSection;
