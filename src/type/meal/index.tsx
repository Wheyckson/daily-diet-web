export type RequestListMeal = {
  meals: [
    {
      id: string;
      user_id: string;
      name: string;
      description: string;
      date: string;
      hour: string;
      is_on_diet: boolean;
    }
  ];
};

export type Meal = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  date: string;
  hour: string;
  is_on_diet: boolean;
};

export type MealGroupByDate = {
  date: string;
  items: Meal[];
};

export type ListMealGroupByDate = MealGroupByDate[];
