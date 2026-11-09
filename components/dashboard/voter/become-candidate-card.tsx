"use client"

import { Loader2, ScrollText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CANDIDATE_FORM_PRICE } from "@/constants/app"
import { Action, Subject } from "@/constants/enums"
import { Can } from "@/lib/acl/context"
import { formatMoney } from "@/lib/format"
import { runWithToast } from "@/lib/notify"
import { useAuthUser } from "@/hooks/use-current-user"
import { usePurchaseCandidateFormMutation } from "@/store/services/users.api"

/** Voters buy the nomination form here to become candidates. */
export function BecomeCandidateCard() {
  const user = useAuthUser()
  const [purchase, { isLoading }] = usePurchaseCandidateFormMutation()

  return (
    <Can I={Action.PURCHASE} a={Subject.CANDIDATE_FORM}>
      <Card className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white ring-0">
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/15">
              <ScrollText className="size-5" />
            </span>
            <div>
              <p className="font-semibold">Want to contest a position?</p>
              <p className="text-sm text-white/80">
                Purchase the nomination form ({formatMoney(CANDIDATE_FORM_PRICE)})
                to become a candidate.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={() =>
              runWithToast(
                () => purchase(user.id).unwrap(),
                "Form purchased. You are now a candidate!"
              )
            }
          >
            {isLoading && <Loader2 className="animate-spin" />}
            Purchase form
          </Button>
        </CardContent>
      </Card>
    </Can>
  )
}
