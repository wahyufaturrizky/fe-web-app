import { useMutation } from "@tanstack/react-query";
import { client } from "../client";

function useCreateOpenApi({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/matcher", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

export { useCreateOpenApi };
