import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // メンテナンスモードのフラグをチェック
  const isMaintenanceMode =
    process.env.NNEXT_PUBLIC_MAINTENANCE_MODE === "true";

  if (isMaintenanceMode) {
    // メンテナンスページへのリダイレクト
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  // 通常のリクエスト処理
  return NextResponse.next();
}

// このミドルウェアを適用するパスを指定
export const config = {
  matcher: "/:path*",
};
