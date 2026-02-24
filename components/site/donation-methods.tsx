import { Container } from "@/components/site/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DonationMethods() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <Container>
        <Badge>Donate</Badge>
        <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
          Donation methods
        </h2>
        <p className="mt-2 text-sm md:text-base text-mutedInk max-w-2xl">
          Choose a method below. We can replace these placeholders with your official numbers and bank details.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="border-black/10">
            <CardContent className="p-6">
              <div className="text-sm font-semibold">MTN Mobile Money</div>
              <div className="mt-2 text-sm text-mutedInk">Pay to:</div>
              <div className="mt-1 text-base font-semibold tracking-tight">+256 7XX XXX XXX</div>
              <div className="mt-3 text-xs text-mutedInk">
                Reason/Reference: Virgo Building Society Donation
              </div>
              <div className="mt-5">
                <Button className="w-full" variant="primary">I’ve sent MoMo</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardContent className="p-6">
              <div className="text-sm font-semibold">Airtel Money</div>
              <div className="mt-2 text-sm text-mutedInk">Pay to:</div>
              <div className="mt-1 text-base font-semibold tracking-tight">+256 7XX XXX XXX</div>
              <div className="mt-3 text-xs text-mutedInk">
                Reason/Reference: Virgo Building Society Donation
              </div>
              <div className="mt-5">
                <Button className="w-full" variant="secondary">I’ve sent Airtel</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardContent className="p-6">
              <div className="text-sm font-semibold">Bank Transfer</div>
              <div className="mt-2 text-sm text-mutedInk">Account name:</div>
              <div className="mt-1 text-base font-semibold tracking-tight">Virgo Building Society</div>

              <div className="mt-3 text-sm text-mutedInk space-y-1">
                <div>Bank: (Your Bank)</div>
                <div>Account: (0000000000)</div>
                <div>Branch: (Branch)</div>
              </div>

              <div className="mt-5">
                <Button className="w-full" variant="secondary">Request bank details</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
