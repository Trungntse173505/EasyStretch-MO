import React, { createContext, useContext, useState } from "react";

// Định nghĩa kiểu dữ liệu bạn muốn thu thập
type OnboardingData = {
  age?: number;      
  weight?: number;   
  gender?: string;    
  goal?: string;     
  // Thêm height nếu API cần
  height?: number; 
};

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
};

const OnboardingContext = createContext<OnboardingContextType>({
  data: {},
  updateData: () => {},
});

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<OnboardingData>({});

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
    console.log("Current Data:", { ...data, ...newData }); // Log để kiểm tra
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);