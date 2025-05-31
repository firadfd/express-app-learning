import { error } from "console";
import express, { NextFunction, Request, Response } from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

export const logWrapper = (options: any) => {
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
      throw new Error("There is an error happened");
    }
  };
};

// Helper to parse JSON safely
function tryParseJSON(str: string): any {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

const errorMiddleWare = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  res.status(500).send("There was a server side error");
};

app.use(logWrapper({ value: true }));
app.use(errorMiddleWare);

// Main route
app.get("/", (req: Request, res: Response) => {
  res.json({
    code: 200,
    success: true,
    message: "This is the main route",
    result: {
      title: "Welcome to my express learning app",
      description: "lets explore the world how do backend works",
      developer: "Firad Fd",
      email: "firadfd833@gmail.com",
      github: "www.github.com/firadfd",
      linkedin: "www.linkedin.com/in/firadfd",
    },
  });
  throw new Error("this is he error message");
});

// signup route
app.post("/signup", (req: Request, res: Response) => {
  res.json({
    code: 200,
    success: true,
    message: "Signup successful",
    result: {
      accessToken: "test-token",
      userInfo: {
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
      },
    },
  });
});

// login route
app.post("/login", (req: Request, res: Response) => {
  res.json({
    code: 200,
    success: true,
    message: "Login successful",

    result: {
      accessToken: "test-token",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
