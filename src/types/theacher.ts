
export interface TeacherResponse {
    id: number;
    user_id: number;
    name: string;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      email: string;
      email_verified_at: string;
      gender: string;
      birthday: string;
      phone: string;
      address: string;
      image: string | null;
      created_at: string;
      updated_at: string;
    };
    subjects: {
      id: number;
      classroom_id: number;
      name: string;
      teacher_id: number;
      created_at: string;
      updated_at: string;
    };
}
