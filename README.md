# Image Annotation App

A modern web application for uploading, managing, and annotating images with a user-friendly interface. This tool allows users to organize images by categories, add rectangular annotations, and filter images based on various metadata properties.

## Features

### Image Management
- Upload images with metadata (size, resolution, format)
- Categorize images for better organization
- View image details and metadata
- Delete images when no longer needed
- Real-time updates with optimistic UI

### Annotation Tools
- Add rectangular annotations to images
- Select, move, and resize annotations
- Customize annotation colors
- Save annotation data
- Detect unsaved changes

### Advanced Filtering
- Search images by name
- Filter by category
- Filter by image dimensions (width/height)
- Filter by file size (KB/MB/GB)
- View active filters with one-click removal

### Responsive Design
- Works on desktop and mobile devices
- Clean and intuitive user interface
- Fast image loading with placeholders

## Technology Stack

- **Frontend**: Next.js 15 with React
- **UI Components**: Material-UI (MUI)
- **State Management**: React Query for server state, React Hooks for local state
- **Styling**: CSS-in-JS with MUI's styling solution
- **Animations**: MUI transitions and animations
- **Image Processing**: Client-side image handling

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bealinawaz/image-annotation-app.git
   cd image-annotation-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Uploading Images
1. Navigate to the Images page
2. Click the "Upload Image" button
3. Fill in image details, select a category, and choose an image file
4. Click "Upload" to add the image to your collection

### Annotating Images
1. Select an image from the gallery
2. Click "Annotate" to open the annotation tool
3. Use the "Add Rectangle" button to create annotations
4. Click and drag to position and resize rectangles
5. Change color using the color picker
6. Save your annotations when finished

### Filtering Images
1. Use the search bar to find images by name
2. Apply filters for category, dimensions and size
3. View active filters and remove them individually
4. Use "Clear All Filters" to reset to default view

## Project Structure

```
/src
  /app                  # Next.js app router pages
  /components           # Reusable React components
    /annotations        # Annotation-related components
    /images             # Image-related components
    /shared             # Shared UI components
  /features             # Feature-specific components
  /hooks                # Custom React hooks
  /models               # Data models and schemas
  /services             # API services
  /utils                # Utility functions
```

## License

[MIT](LICENSE)
