"use server";

import {
    getCurrentSavingsPlan,
    upsertSavingsPlan,
    type CreateSavingsPlanInput,
    type SavingsPlanWithSuggestion,
} from "@/services/savings-plan";
import type { ServiceResponse } from "@/services/base";
import type { SavingsPlan } from "@/types/database";

export async function fetchSavingsPlan(): Promise<
    ServiceResponse<SavingsPlanWithSuggestion | null>
> {
    return getCurrentSavingsPlan();
}

export async function saveSavingsPlan(
    input: CreateSavingsPlanInput
): Promise<ServiceResponse<SavingsPlan>> {
    return upsertSavingsPlan(input);
}
