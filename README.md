# Forminator

Forminator is a powerful and user-friendly form builder application built with Next.js. It allows you to create and customize forms with ease, and provides a seamless experience for both form creators and respondents.

## Features

- Intuitive drag-and-drop form builder
- Rich selection of form fields (text, number, date, checkbox, select, etc.)
- Live preview of the form as you build
- Form submission tracking and data management
- Responsive design for optimal viewing on various devices
- Authentication and authorization with Clerk.dev

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Neon PostgreSQL](https://neon.tech/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
- [Clerk.dev](https://clerk.dev/) - Authentication and authorization solution
- [shadcn/ui](https://ui.shadcn.com/) - Styled, accessible component library
- [React Hook Form](https://react-hook-form.com/) - Library for building forms in React
- [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation library

## Getting Started

1. Clone the repository: `git clone https://github.com/your-repo/forminator.git`
2. Install dependencies: 
   `npm install`   
3. Create a `.env` file based on the provided `.env.example` and configure the required environment variables.
4. Migrate Prisma Schema to Database & Generate Prisma Client
   ```
   npx prisma migrate dev --name init
   npm run prisma_generate
   ```
5. Start the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.