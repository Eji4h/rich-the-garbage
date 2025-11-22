/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;
type ENV = {
  LIKES_KV: KVNamespace;
};

// Depending on your adapter mode
// If you use `output: "server"` or `output: "hybrid"`
interface ImportMetaEnv {
  readonly LIKES_KV: KVNamespace;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals extends Record<string, any> {
    runtime: {
      env: ENV;
    };
  }
}
