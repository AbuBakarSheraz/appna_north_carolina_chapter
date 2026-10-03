import { GraduationCap, HeartPulse, Users, Vote } from "lucide-react";

// To add a chair photo: put the image in public/commitee and set  image: "/commitee/filename.jpeg"
export const committees = [
  {
    title: "CME Committee",
    description: "Advancing continuous medical education and professional excellence.",
    icon: HeartPulse,
    chair: {
      name: "Hafiz Yaseen Sarwar, MD",
      detail: "Associate Program Director, Pulmonary Critical Care Fellowship Program, Cape Fear Valley Health",
      image: "/commitee/sarwar.jpeg",
    },
  },
  {
    title: "Future Physicians Committee",
    description: "This committee will support our youth who aspire to become physicians. Drawing on their varied backgrounds and experiences, committee members will offer guidance and mentorship as students explore a path toward medical school.",
    icon: GraduationCap,
    chair: {
      name: "Dr. Maryam Ali",
      detail: "ECU, PGY-2",
      image: "/commitee/maryam.jpeg",
    },
    members: [
      { name: "Mohsen Zaikeb", detail: "ECU, M4" },
      { name: "Mirha Qadir", detail: "UNC, M4" },
      { name: "Faryal Gilani", detail: "ECU, M3" },
    ],
  },
  {
    title: "Young Physicians Committee",
    description: "This committee will support young graduates who are seeking guidance and mentorship as they pursue training and careers in North Carolina.",
    icon: Users,
    chair: {
      name: "Dr. Mariam Tariq Awana",
      detail: "ECU, PGY-4",
      image: "/commitee/mariam.jpeg",
    },
    coChair: {
      name: "Dr. Alina Faheem",
      detail: "ECU, PGY-3",
    },
  },
  {
    title: "Election & Nomination Committee",
    description: "Ensuring transparent, ethical, and fair leadership selection within the chapter.",
    icon: Vote,
    chair: {
      name: "Waheed Akhter, MD",
      detail: "Cardiology, UNC Goldsboro",
      image: "/commitee/waheed.png",
    },
  },
];