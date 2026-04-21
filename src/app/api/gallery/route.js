// app/api/gallery/route.js

import cloudinary from "../../../lib/cloudinary";

export async function GET() {
  try {
    const results = await cloudinary.search
      .expression("resource_type:image")
      .sort_by("public_id", "asc")
      .max_results(113)
      .execute();

    const images = results.resources.map((img) => {
      const base = img.secure_url;

      /**
       * Helper: inject Cloudinary transformation string after /upload/
       */
      const transform = (t) => base.replace("/upload/", `/upload/${t}/`);

      return {
        id: img.public_id,
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,

        /**
         * THUMBNAIL  (grid tile)
         * Three explicit format variants so the <picture> element can pick
         * the best one the browser actually supports.
         *
         *  avif  – smallest file, best quality-per-byte (Chrome 85+, FF 93+)
         *  webp  – wide support fallback
         *  jpg   – universal fallback (strip alpha; galleries are photos)
         *
         * c_fill keeps every tile the same visual weight.
         * q_auto lets Cloudinary choose per-format quality floor.
         */
        thumb: {
          avif: transform("w_600,c_fill,q_auto,f_avif"),
          webp: transform("w_600,c_fill,q_auto,f_webp"),
          fallback: transform("w_600,c_fill,q_auto,f_jpg"),
        },

        /**
         * FULL-RESOLUTION  (lightbox)
         * Same three variants, wider, no crop so the full image shows.
         */
        full: {
          avif: transform("w_2400,q_auto,f_avif"),
          webp: transform("w_2400,q_auto,f_webp"),
          fallback: transform("w_2400,q_auto,f_jpg"),
        },

        /**
         * BLUR PLACEHOLDER  (shown while thumb loads)
         * Tiny 40-px wide JPEG; browser decodes instantly.
         * Format intentionally NOT avif/webp: we want max compatibility
         * for the placeholder which must appear before any JS runs.
         */
        blur: transform("w_40,q_10,f_jpg,e_blur:800"),

        alt: img.context?.custom?.alt ?? img.public_id.split("/").pop(),
      };
    });

    return Response.json(images);
  } catch (error) {
  console.error("[gallery] FULL ERROR:", error);
  return Response.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  );
}
}