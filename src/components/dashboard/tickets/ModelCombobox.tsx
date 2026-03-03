import { GenericCombobox } from "@/components/common/ComboBox"
import { useOpenRouterModels } from "@/hooks/useOpenRouterModels"
interface ModelComboboxProps {
    value: string
    onChange: (value: string) => void
}

export function ModelCombobox({ value, onChange }: ModelComboboxProps) {

    const {
        visibleModels,
        isLoading,
        setSearch,
        loadMore,
        hasMore,
        totalFiltered,
    } = useOpenRouterModels()

    return (
        <GenericCombobox
            items={visibleModels}
            value={value}
            onChange={onChange}
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
    )
}