export type filesStatus = {
  name: string | null;
  uuid: string;
  uploading?: boolean;
  uploaded?: boolean;
};

export interface FilesData {
  uuid: string;
  name: string;
  url: string;
}
