import { BarChart3, Layers, ShieldCheck, type LucideIcon } from "lucide-react"

export interface AuthSlide {
  icon: LucideIcon
  title: string
  description: string
  poll: { question: string; options: { label: string; value: number }[] }
}

export const AUTH_SLIDES: AuthSlide[] = [
  {
    icon: Layers,
    title: "Every poll, every view",
    description:
      "Switch between ballot, results and audit views of the same vote without losing context.",
    poll: {
      question: "Who should chair the 2027 board?",
      options: [
        { label: "A. Okafor", value: 46 },
        { label: "M. Bello", value: 34 },
        { label: "T. Adeyemi", value: 20 },
      ],
    },
  },
  {
    icon: BarChart3,
    title: "Live results, instantly",
    description:
      "Watch turnout and tallies update in real time as ballots come in.",
    poll: {
      question: "Approve the annual budget?",
      options: [
        { label: "Approve", value: 72 },
        { label: "Reject", value: 18 },
        { label: "Abstain", value: 10 },
      ],
    },
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    description:
      "One member, one vote. Role-based access keeps ballots private and verifiable.",
    poll: {
      question: "Move AGM to Q3?",
      options: [
        { label: "Yes", value: 58 },
        { label: "No", value: 42 },
      ],
    },
  },
]

export const SLIDE_INTERVAL_MS = 5000
