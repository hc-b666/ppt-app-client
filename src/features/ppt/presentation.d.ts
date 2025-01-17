declare global {
  interface Presentation {
    id: string;
    author: string;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  }

  interface PresentationAuthorClaim {
    presentationId: string;
    authorToken: string;
  }
}

export {};
