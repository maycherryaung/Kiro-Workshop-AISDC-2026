export interface Priority {
  id:   number;
  name: "High" | "Medium" | "Low";
  icon: string;
}

export interface Category {
  id:    number;
  name:  string;
  emoji: string;
}

export interface Task {
  id:          number;
  title:       string;
  description: string;
  status:      "todo" | "in_progress" | "completed";
  due_date:    string | null;
  created_at:  string;
  updated_at:  string;
  priority:    Priority;
  category:    Category;
}

export interface Comment {
  id:         number;
  task_id:    number;
  body:       string;
  created_at: string;
}

export type TaskStatus = Task["status"];
