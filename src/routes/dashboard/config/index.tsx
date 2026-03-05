import { PageTransition } from "@/components/common/layout/PageTransition"
import { SettingsForm } from "@/components/dashboard/config/SettingsForm"

export default function ConfigPage() {
    return (
        <PageTransition>
            <SettingsForm />
        </PageTransition>
    )
}