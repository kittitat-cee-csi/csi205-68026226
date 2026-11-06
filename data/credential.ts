export type User = {
  email: string;
  pass: string;
  name: string;
  role: string;
  other?: string;
};

export const users: User[] = [
  {
    email: "admin@company.com",
    pass: "pass",
    name: "ยิ่งใหญ่ โอฬาร",
    role: "admin",
  },
  {
    email: "user@company.com",
    pass: "pass",
    name: "สมหญิง จริงใจ",
    role: "user",
  },
  {
    email: "manager@company.com",
    pass: "pass",
    name: "นาง จัดการ เฉพาะกิจ",
    role: "manager",
  },
];

export type Credential = {
  token: string;
  email: string;
  name: string;
  role: string;
};

export const login = (email: string, pass: string): Promise<Credential> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 80% success simulation as taught in CSI205
      if (Math.random() <= 0.8) {
        const u = users.find((user) => user.email === email && user.pass === pass);
        if (!u) {
          reject("usernotfound");
          return;
        }
        const cred: Credential = {
          token: "tok_" + Math.random().toString(36).substring(2) + Date.now().toString(36),
          email: u.email,
          name: u.name,
          role: u.role,
        };
        resolve(cred);
      } else {
        reject("Connection refused");
      }
    }, 1000 + Math.random() * 2000);
  });
};

export const logout = (token?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};
