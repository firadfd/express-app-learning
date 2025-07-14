import { Request, Response, NextFunction } from "express";
import { tryParseJSON } from "../handler";

const logWrapper = (options: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (options.value) {
      const start = Date.now();
      const { method, originalUrl, headers, query, body } = req;

      const oldWrite = res.write;
      const oldEnd = res.end;

      const chunks: Buffer[] = [];

      res.write = function (chunk: any): boolean {
        chunks.push(Buffer.from(chunk));
        return oldWrite.apply(res, arguments as any);
      };

      res.end = function (chunk: any): any {
        if (chunk) {
          chunks.push(Buffer.from(chunk));
        }

        const responseBodyString = Buffer.concat(chunks).toString("utf8");
        const responseBody = tryParseJSON(responseBodyString);
        const duration = Date.now() - start;

        const log = {
          url: originalUrl,
          timestamp: `${new Date().toLocaleTimeString()} ${new Date().toDateString()}`,
          method,
          headers,
          query,
          requestBody: body,
          statusCode: res.statusCode,
          responseBody,
          duration: `${duration}ms`,
        };

        console.log(JSON.stringify(log, null, 2));

        return oldEnd.apply(res, arguments as any);
      };

      next();
    } else {
      next(new Error("There is an error happened"));
    }
  };
};

export default logWrapper;
