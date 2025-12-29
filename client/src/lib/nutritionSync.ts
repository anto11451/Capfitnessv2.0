// Data sync between Fuel Tracker and Macro Calculator
export interface NutritionData {
  date: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
  caloriesGoal: number;
}

const NUTRITION_SYNC_KEY = "capsfitness_nutrition_sync";

export function saveMacroData(data: NutritionData) {
  localStorage.setItem(NUTRITION_SYNC_KEY, JSON.stringify(data));
  // Trigger custom event for real-time sync
  window.dispatchEvent(
    new CustomEvent("nutrition-data-updated", { detail: data })
  );
}

export function getMacroData(): NutritionData | null {
  const stored = localStorage.getItem(NUTRITION_SYNC_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearMacroData() {
  localStorage.removeItem(NUTRITION_SYNC_KEY);
  window.dispatchEvent(new CustomEvent("nutrition-data-updated", { detail: null }));
}

export function syncFuelTrackerWithMacros(
  fuelData: Partial<NutritionData>,
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }
) {
  const merged: NutritionData = {
    date: new Date().toISOString().split("T")[0],
    protein: fuelData.protein || 0,
    carbs: fuelData.carbs || 0,
    fats: fuelData.fats || 0,
    calories: fuelData.calories || 0,
    proteinGoal: goals.protein,
    carbsGoal: goals.carbs,
    fatsGoal: goals.fats,
    caloriesGoal: goals.calories,
  };
  saveMacroData(merged);
  return merged;
}
