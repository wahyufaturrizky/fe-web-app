import { useMutation } from "@tanstack/react-query";
import { client } from "../client";

function useCreateOpenApi({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/matchers", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

export { useCreateOpenApi };
