"use client"

// views/campos/ui/campos-explorer.tsx
import { useMemo, useState } from "react";
import { useFarms, useFarmMutations, FarmForm, type Farm } from "@/entities/farm";
import { useHerds, useHerdMutations, HerdForm, type Herd } from "@/entities/herd";
import { useCows, useCowMutations, CowForm } from "@/entities/cow";
import { AnimatedStep, Button, Card, Modal } from "@/shared/ui";
import { useFarmCounts } from "../model/use-farm-counts";
import { useCamposNavigation } from "../model/use-campos-navigation";
import { HerdsPanel } from "./herds-panel";
import { CowsPanel } from "./cows-panel";
import { FarmRichCard } from "./farm-rich-card";
import { FarmListRow } from "./farm-list-row";
import { AddFarmTile } from "./add-farm-tile";
import { OperationSummary } from "./operation-summary";
import { FarmSearchField } from "./farm-search-field";

function pluralCount(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

// modulo 1: navegacion campo -> rodeo -> vacas dentro de una sola pantalla tipo SPA.
// mobile: layout de campos se adapta a la cantidad (1 = hero, 2 = grid partido, 3+ = lista). desktop: siempre lista + panel lateral con drill-down.
export function CamposExplorer() {
  const { farms, isLoading } = useFarms();
  const counts = useFarmCounts(farms);
  const nav = useCamposNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    createFarm,
    updateFarm,
    deactivateFarm,
    error: farmError,
    clearError: clearFarmError,
    isSaving: isSavingFarm,
  } = useFarmMutations();
  const [isFarmFormOpen, setIsFarmFormOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  const selectedFarm = farms.find((farm) => farm.id === nav.selectedFarmId) ?? null;
  const selectedCounts = nav.selectedFarmId !== null ? counts[nav.selectedFarmId] : undefined;

  const { herds, isLoading: isLoadingHerds } = useHerds(nav.selectedFarmId);
  const {
    createHerd,
    updateHerd,
    deactivateHerd,
    error: herdError,
    clearError: clearHerdError,
    isSaving: isSavingHerd,
  } = useHerdMutations(nav.selectedFarmId);
  const [isHerdFormOpen, setIsHerdFormOpen] = useState(false);
  const [editingHerd, setEditingHerd] = useState<Herd | null>(null);

  const selectedHerd = herds.find((herd) => herd.id === nav.selectedHerdId) ?? null;

  const { cows, isLoading: isLoadingCows } = useCows(nav.selectedFarmId);
  const {
    createCow,
    error: cowError,
    clearError: clearCowError,
    isSaving: isSavingCow,
  } = useCowMutations(nav.selectedFarmId);
  const [isCowFormOpen, setIsCowFormOpen] = useState(false);

  const herdCows = nav.selectedHerdId !== null ? cows.filter((cow) => cow.herdId === nav.selectedHerdId) : [];
  const cowFormHerds = selectedHerd ? [selectedHerd, ...herds.filter((herd) => herd.id !== selectedHerd.id)] : herds;

  const totalCows = farms.reduce((sum, farm) => sum + (counts[farm.id]?.cowCount ?? 0), 0);
  const totalHerds = farms.reduce((sum, farm) => sum + (counts[farm.id]?.herdCount ?? 0), 0);
  const totalHectares = farms.reduce((sum, farm) => sum + (farm.areaHectares ?? 0), 0);

  const filteredFarms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return farms;
    return farms.filter(
      (farm) => farm.name.toLowerCase().includes(query) || farm.description?.toLowerCase().includes(query)
    );
  }, [farms, searchQuery]);

  async function handleCreateFarm(data: Parameters<typeof createFarm>[0]) {
    await createFarm(data);
    setIsFarmFormOpen(false);
  }

  async function handleUpdateFarm(data: Parameters<typeof updateFarm>[1]) {
    if (!editingFarm) return;
    await updateFarm(editingFarm.id, data);
    setEditingFarm(null);
  }

  async function handleDeleteFarm(farm: Farm) {
    if (!window.confirm(`Dar de baja "${farm.name}"?`)) return;
    await deactivateFarm(farm.id);
    if (farm.id === nav.selectedFarmId) nav.backToFarms();
  }

  async function handleCreateHerd(data: Parameters<typeof createHerd>[0]) {
    await createHerd(data);
    setIsHerdFormOpen(false);
  }

  async function handleUpdateHerd(data: Parameters<typeof createHerd>[0]) {
    if (!editingHerd) return;
    await updateHerd(editingHerd.id, data);
    setEditingHerd(null);
  }

  async function handleCreateCow(data: Parameters<typeof createCow>[0]) {
    await createCow(data);
    setIsCowFormOpen(false);
  }

  function selectFarm(farm: Farm) {
    nav.openFarm(farm.id);
  }

  function openMainHerd(farm: Farm, herdId: number) {
    nav.openFarm(farm.id);
    nav.openHerd(herdId);
  }

  return (
    <div>
      {nav.step !== "cows" && (
        <div className="lg:hidden">
          <h1 className="text-3xl font-bold text-rufo-text">{nav.step === "farms" ? "Campos" : "Rodeos"}</h1>
          <p className="mt-1 text-sm text-rufo-text-muted">
            {nav.step === "farms"
              ? `${pluralCount(farms.length, "campo")} · ${totalCows} animales`
              : `${pluralCount(selectedCounts?.herdCount ?? herds.length, "rodeo")} · ${selectedCounts?.cowCount ?? 0} animales`}
          </p>
        </div>
      )}
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-rufo-text">Campos</h1>
        <p className="mt-1 text-sm text-rufo-text-muted">
          {pluralCount(farms.length, "campo")} · {totalCows} animales
        </p>
      </div>

      {isLoading && <p className="mt-6 text-sm text-rufo-text-muted">Cargando campos...</p>}

      {!isLoading && farms.length === 0 && (
        <div className="mt-6 flex flex-col items-start gap-3">
          <p className="text-sm text-rufo-text-muted">Todavia no cargaste ningun campo.</p>
          <Button onClick={() => setIsFarmFormOpen(true)}>+ Nuevo campo</Button>
        </div>
      )}

      {!isLoading && farms.length > 0 && (
        <>
          {/* Mobile: layout que se adapta a la cantidad de campos */}
          <div className="mt-4 overflow-hidden lg:hidden">
            <AnimatedStep
              stepKey={
                nav.step === "cows" ? `cows-${nav.selectedHerdId}` : nav.step === "herds" ? `herds-${nav.selectedFarmId}` : "farms"
              }
              direction={nav.direction}
            >
              {nav.step === "farms" && (
                <>
                  {farms.length === 1 && (
                    <FarmRichCard
                      farm={farms[0]}
                      counts={counts[farms[0].id]}
                      onViewAction={() => selectFarm(farms[0])}
                      onEditAction={() => setEditingFarm(farms[0])}
                      onDeleteAction={() => handleDeleteFarm(farms[0])}
                      onOpenMainHerdAction={() => {
                        const mainHerd = counts[farms[0].id]?.mainHerd;
                        if (mainHerd) openMainHerd(farms[0], mainHerd.id);
                      }}
                    />
                  )}

                  {farms.length === 2 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {farms.map((farm) => (
                        <FarmRichCard
                          key={farm.id}
                          farm={farm}
                          counts={counts[farm.id]}
                          compact
                          onViewAction={() => selectFarm(farm)}
                          onEditAction={() => setEditingFarm(farm)}
                          onDeleteAction={() => handleDeleteFarm(farm)}
                          onOpenMainHerdAction={() => {
                            const mainHerd = counts[farm.id]?.mainHerd;
                            if (mainHerd) openMainHerd(farm, mainHerd.id);
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {farms.length >= 3 && (
                    <div className="flex flex-col gap-4">
                      <OperationSummary totalHectares={totalHectares} herdCount={totalHerds} cowCount={totalCows} />
                      <FarmSearchField
                        value={searchQuery}
                        onChangeAction={setSearchQuery}
                        onAddAction={() => setIsFarmFormOpen(true)}
                      />
                      <p className="text-xs font-medium uppercase tracking-wide text-rufo-text-muted">Tus campos</p>
                      <div className="flex flex-col gap-3">
                        {filteredFarms.map((farm) => (
                          <FarmListRow
                            key={farm.id}
                            farm={farm}
                            counts={counts[farm.id]}
                            isSelected={farm.id === nav.selectedFarmId}
                            onSelectAction={() => selectFarm(farm)}
                            onEditAction={() => setEditingFarm(farm)}
                            onDeleteAction={() => handleDeleteFarm(farm)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {farms.length <= 2 && (
                    <div className="mt-4">
                      <AddFarmTile onClickAction={() => setIsFarmFormOpen(true)} />
                    </div>
                  )}
                </>
              )}

              {nav.step === "herds" && selectedFarm && (
                <div>
                  <button
                    type="button"
                    onClick={nav.backToFarms}
                    className="mb-3 text-sm font-medium text-rufo-primary hover:underline"
                  >
                    &larr; Volver a campos
                  </button>
                  <HerdsPanel
                    farm={selectedFarm}
                    herdCount={selectedCounts?.herdCount}
                    cowCount={selectedCounts?.cowCount}
                    herds={herds}
                    cows={cows}
                    isLoadingHerds={isLoadingHerds}
                    onSelectHerdAction={nav.openHerd}
                    onAddHerdAction={() => setIsHerdFormOpen(true)}
                    onEditHerdAction={(herdId) => setEditingHerd(herds.find((herd) => herd.id === herdId) ?? null)}
                    onDeactivateHerdAction={deactivateHerd}
                    onEditFarmAction={() => setEditingFarm(selectedFarm)}
                    onDeactivateFarmAction={() => handleDeleteFarm(selectedFarm)}
                  />
                </div>
              )}

              {nav.step === "cows" && selectedHerd && (
                <CowsPanel
                  farmName={selectedFarm?.name}
                  herd={selectedHerd}
                  cows={herdCows}
                  isLoadingCows={isLoadingCows}
                  onAddCowAction={() => setIsCowFormOpen(true)}
                  onBackToHerdsAction={nav.backToHerds}
                />
              )}
            </AnimatedStep>
          </div>

          {/* Desktop: lista de campos + panel lateral con drill-down a rodeos y vacas */}
          <div className="mt-6 hidden gap-6 lg:grid lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-4">
              <OperationSummary totalHectares={totalHectares} herdCount={totalHerds} cowCount={totalCows} />
              <FarmSearchField
                value={searchQuery}
                onChangeAction={setSearchQuery}
                onAddAction={() => setIsFarmFormOpen(true)}
              />
              <div className="flex flex-col gap-3">
                {filteredFarms.map((farm) => (
                  <FarmListRow
                    key={farm.id}
                    farm={farm}
                    counts={counts[farm.id]}
                    isSelected={farm.id === nav.selectedFarmId}
                    onSelectAction={() => selectFarm(farm)}
                    onEditAction={() => setEditingFarm(farm)}
                    onDeleteAction={() => handleDeleteFarm(farm)}
                  />
                ))}
                {filteredFarms.length === 0 && (
                  <Card className="!p-0">
                    <p className="px-4 py-6 text-center text-sm text-rufo-text-muted">
                      No encontramos campos para &quot;{searchQuery}&quot;.
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {nav.step === "cows" && selectedHerd ? (
              <CowsPanel
                herd={selectedHerd}
                cows={herdCows}
                isLoadingCows={isLoadingCows}
                onAddCowAction={() => setIsCowFormOpen(true)}
                onBackToHerdsAction={nav.backToHerds}
              />
            ) : selectedFarm ? (
              <HerdsPanel
                farm={selectedFarm}
                herdCount={selectedCounts?.herdCount}
                cowCount={selectedCounts?.cowCount}
                herds={herds}
                cows={cows}
                isLoadingHerds={isLoadingHerds}
                onSelectHerdAction={nav.openHerd}
                onAddHerdAction={() => setIsHerdFormOpen(true)}
                onEditHerdAction={(herdId) => setEditingHerd(herds.find((herd) => herd.id === herdId) ?? null)}
                onDeactivateHerdAction={deactivateHerd}
                onEditFarmAction={() => setEditingFarm(selectedFarm)}
                onDeactivateFarmAction={() => handleDeleteFarm(selectedFarm)}
              />
            ) : (
              <Card className="flex items-center justify-center text-center text-sm text-rufo-text-muted">
                Seleccioná un campo para ver sus rodeos.
              </Card>
            )}
          </div>
        </>
      )}

      {isFarmFormOpen && (
        <Modal
          title="Nuevo campo"
          onCloseAction={() => {
            setIsFarmFormOpen(false);
            clearFarmError();
          }}
        >
          <FarmForm
            isSaving={isSavingFarm}
            error={farmError}
            onSubmitAction={handleCreateFarm}
            onCancelAction={() => {
              setIsFarmFormOpen(false);
              clearFarmError();
            }}
          />
        </Modal>
      )}

      {editingFarm && (
        <Modal
          title="Editar campo"
          onCloseAction={() => {
            setEditingFarm(null);
            clearFarmError();
          }}
        >
          <FarmForm
            initialFarm={editingFarm}
            isSaving={isSavingFarm}
            error={farmError}
            onSubmitAction={handleUpdateFarm}
            onCancelAction={() => {
              setEditingFarm(null);
              clearFarmError();
            }}
          />
        </Modal>
      )}

      {isHerdFormOpen && selectedFarm && (
        <Modal
          title="Nuevo rodeo"
          onCloseAction={() => {
            setIsHerdFormOpen(false);
            clearHerdError();
          }}
        >
          <HerdForm
            isSaving={isSavingHerd}
            error={herdError}
            onSubmitAction={handleCreateHerd}
            onCancelAction={() => {
              setIsHerdFormOpen(false);
              clearHerdError();
            }}
          />
        </Modal>
      )}

      {editingHerd && (
        <Modal
          title="Editar rodeo"
          onCloseAction={() => {
            setEditingHerd(null);
            clearHerdError();
          }}
        >
          <HerdForm
            initialHerd={editingHerd}
            isSaving={isSavingHerd}
            error={herdError}
            onSubmitAction={handleUpdateHerd}
            onCancelAction={() => {
              setEditingHerd(null);
              clearHerdError();
            }}
          />
        </Modal>
      )}

      {isCowFormOpen && selectedFarm && (
        <Modal
          title="Cargar animal"
          onCloseAction={() => {
            setIsCowFormOpen(false);
            clearCowError();
          }}
        >
          <CowForm
            herds={cowFormHerds}
            isSaving={isSavingCow}
            error={cowError}
            onSubmitAction={handleCreateCow}
            onCancelAction={() => {
              setIsCowFormOpen(false);
              clearCowError();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
