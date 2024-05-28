export type PostType = {
  id: number;
  user_id: number;
  user_name: string;
  user_pf_img_url: string;
  group_id: number | null;
  group_title: string | null;
  title: string;
  description: string;
  img_url: string;
  status: "public" | "private";
  tag: string;
  likes: number[];
  like_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
  is_highlighted: number;
};
