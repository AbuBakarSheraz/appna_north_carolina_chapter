// app/api/gallery/route.js

import cloudinary from "../../../lib/cloudinary";

// Keep the Cloudinary folder names on the server. This prevents the public
// endpoint from being used to browse unrelated assets in the account.
const galleries = {
  "meet-n-greet": ["appna_meet_greet_2026"],
  banquet: ["appna_nc_banquet_2026"], // change if the real folder name differs
};

export async function GET(request) {
  const event = new URL(request.url).searchParams.get("event");
  const folders = galleries[event];

  if (!folders) {
    return Response.json({ error: "Unknown gallery event." }, { status: 400 });
  }

  try {
    let resources = [];
    const folderErrors = [];

    for (const folder of folders) {
      try {
        const results = await cloudinary.api.resources_by_asset_folder(folder, {
          max_results: 500,
          context: true,
        });

        console.log(`[gallery] ${event}: folder "${folder}" returned ${results.resources.length} assets`);

        if (results.resources.length > 0) {
          resources = results.resources;
          break;
        }
      } catch (err) {
        // A missing folder should not break the whole request
        const message = err?.error?.message ?? err?.message ?? String(err);
        console.error(`[gallery] Folder "${folder}" failed:`, message);
        folderErrors.push(`${folder}: ${message}`);
      }
    }

    // Every folder errored out, so this is a real failure (config, auth, etc.)
    if (resources.length === 0 && folderErrors.length === folders.length) {
      return Response.json(
        {
          error: "Unable to load this gallery.",
          ...(process.env.NODE_ENV !== "production" && { details: folderErrors }),
        },
        { status: 500 }
      );
    }

    const images = resources
      .filter((img) => img.resource_type === "image")
      .map((img) => {
        const base = img.secure_url;

        // Inject a Cloudinary transformation string after /upload/
        const transform = (t) => base.replace("/upload/", `/upload/${t}/`);

        return {
          id: img.public_id,
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,

          // Grid tile: avif, then webp, then jpg for the <picture> element
          thumb: {
            avif: transform("w_600,c_fill,q_auto,f_avif"),
            webp: transform("w_600,c_fill,q_auto,f_webp"),
            fallback: transform("w_600,c_fill,q_auto,f_jpg"),
          },

          // Lightbox: wider, no crop so the full image shows
          full: {
            avif: transform("w_2400,q_auto,f_avif"),
            webp: transform("w_2400,q_auto,f_webp"),
            fallback: transform("w_2400,q_auto,f_jpg"),
          },

          // Tiny blurred placeholder shown while the thumb loads
          blur: transform("w_40,q_10,f_jpg,e_blur:800"),

          alt: img.context?.custom?.alt ?? img.public_id.split("/").pop(),
        };
      });

    return Response.json(images);
  } catch (error) {
    console.error(`[gallery] Failed to load ${event}:`, error);
    return Response.json({ error: "Unable to load this gallery." }, { status: 500 });
  }
}