import { getAuth } from "firebase/auth";
import { paths } from "@/schema";
import { FilesFormType } from "@/common_components/form_answer/FormItems";
import { client } from "./openapi";
import { sosFileType } from "./file";

type Visibilities = "public" | "private";
export const postFile = async (visibility: Visibilities, file: File) => {
  const user = getAuth().currentUser;
  if (!user) {
    return;
  }
  const accessToken = await user.getIdToken();

  const body = new FormData();

  body.append("file", file);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/files?visibility=${visibility}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: body,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const json = await response.json();
      return json as paths["/files"]["post"]["responses"]["201"]["content"]["application/json"];
    })
    .catch((error) => {
      throw error;
    });

  return response;
};

export type FileIds = { [itemId: string]: string[] };

export const postFiles = async (visibility: Visibilities, files: FilesFormType) => {
  const fileIds: FileIds = {};
  for (const file of Array.from(files)) {
    if (!file[1]) {
      continue;
    }

    const alreadyUploaded: string[] = [];

    const ids = (
      await Promise.all(
        [...Array(file[1].length)]
          .map((_, i) => i)
          .filter((i, _) => {
            const f = file[1]?.item(i);
            if (f && f.type === sosFileType) {
              alreadyUploaded.push(f?.name);
              return false;
            } else {
              return true;
            }
          })
          .map(async (i, _) => {
            return new Promise(async (resolve, reject) => {
              const f = file[1]?.item(i);
              if (!f) {
                return;
              }
              try {
                const response = (await postFile(visibility, f))?.ids;
                console.debug("Success to upload file: ");
                console.debug(response);
                resolve(response);
                return response;
              } catch (e: unknown) {
                console.debug("Failed to upload file: ");
                console.debug(e);
                reject(e);
                return false;
              }
            });
          }),
      )
    ).flat();

    if (ids.some((v) => !v)) {
      // エラーがあったら全てのファイルを削除した上でreturn
      await deleteMultipleUploadedFiles(ids);
      return;
    }

    // falsyのもの以外を抽出(本来上の条件分岐で絞り込めているはずだが、現在のTSのバージョン(5.3.3)ではうまく推論されないためこれを書いている)
    fileIds[file[0]] = ids.flatMap((v) => v || []).concat(alreadyUploaded);
  }
  return fileIds;
};

export const deleteMultipleUploadedFiles = async (ids: (string | false | undefined)[]) => {
  return await Promise.all(
    ids.map(async (id_) => {
      if (id_) {
        // 削除できなくても無視
        await client
          .DELETE("/files/{file_id}", { params: { path: { file_id: id_ } } })
          .then()
          .catch();
      }
    }),
  );
};

export const deleteAllUploadedFiles = async (fileIds: FileIds) => {
  await Promise.all(
    Object.keys(fileIds).map((itemId) => {
      deleteMultipleUploadedFiles(fileIds[itemId]);
    }),
  );
};
