import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
 
import {Button} from "@/components/base/buttons/button";
export const WithLabelAndHintDemo = () => {
    return ( <div>
        <RadioGroup aria-label="Pricing plans" defaultValue="basic">
            <RadioButton label="Basic plan" hint="Up to 10 users and 20 GB data." value="basic" />
            <RadioButton label="Business plan" hint="Up to 20 users and 40 GB data." value="business" />
            <RadioButton label="Enterprise plan" hint="Unlimited users and unlimited data." value="enterprise" />
        </RadioGroup>
    </div>
    );
};

export default function Billing() {
  return(
    <div className="flex flex-wrap flex-col items-center justify-center overflow-hidden gap-4 mt-10">
      <WithLabelAndHintDemo/>
      <Button size="lg" className="mt-10">Submit</Button>
    </div>
  )
}

