'use client'

import { useEffect } from "react"
import { Bot } from "lucide-react"
import { useOpenRouterModels } from "@/hooks/useOpenRouterModels"
import { GenericCombobox } from "@/components/common/ComboBox"
import { useOpenRouterConfigStore } from "@/store/openRouter/useOpenRouterConfig"
import { Form, FormikProvider, useFormik } from "formik"
import InputField from "@/components/common/InputField"
import { useDebounce } from "@/hooks/useDebounce"

export function SettingsForm() {
    const { apiKey, model, setApiKey, setModel } = useOpenRouterConfigStore()
    const {
        visibleModels,
        isLoading,
        setSearch,
        loadMore,
        hasMore,
        totalFiltered,
    } = useOpenRouterModels()
    const formik = useFormik({
        initialValues: {
            apiKey,
            model,
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            setApiKey(values.apiKey)
            setModel(values.model)
        },
    })
    const debouncedApiKey = useDebounce(formik.values.apiKey, 500)
    const debouncedModel = useDebounce(formik.values.model, 500)

    useEffect(() => {
        if (debouncedApiKey) {
            setApiKey(debouncedApiKey)
        }
    }, [debouncedApiKey])

    useEffect(() => {
        if (debouncedModel) {
            setModel(debouncedModel)
        }
    }, [debouncedModel])
    return (
        <FormikProvider value={formik}>
            <Form>
                <div className="space-y-4 flex flex-wrap gap-4">
                    <InputField
                        className="min-w-125"
                        name="apiKey"
                        label="API Key"
                        placeholder="sk-or-v1-..."
                    />
                    <div className="space-y-2 w-100">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            Modelo
                        </label>
                        <GenericCombobox
                            items={visibleModels}
                            value={model}
                            onChange={setModel}
                            getValue={(m) => m.id}
                            getLabel={(m) => m.name}
                            isLoading={isLoading}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                            onSearch={setSearch}
                            totalCount={totalFiltered}
                            placeholder="Seleccionar modelo..."
                            searchPlaceholder="Buscar modelo..."
                            renderItem={(model, _selected) => (
                                <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">
                                        {model.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-mono truncate">
                                        {model.id}
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </Form>
        </FormikProvider>

    )
}