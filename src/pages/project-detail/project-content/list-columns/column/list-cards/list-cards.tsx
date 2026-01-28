import Card from "./card/card";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { type Card as CardType } from "@/types/project";
import { DetailModal } from "@/components/pages/project-details/detail-modal";

interface IProps {
  cards: CardType[];
}

function ListCards({ cards }: IProps) {
  const cardIds = useMemo(() => {
    return cards.map((card) => card._id);
  }, [cards]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleCardClick = (cardId: string) => {
    setActiveCardId(cardId);
    setIsDetailModalOpen(true);
  };

  console.log("Active Card ID:", activeCardId);

  return (
    <>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 overflow-x-hidden overflow-y-auto max-h-110 pt-0 pr-1 pb-2 pl-2">
          {cards.map((card) => (
            <Card key={card._id} card={card} onClick={handleCardClick} />
          ))}
        </div>
      </SortableContext>

      <DetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        cardId={activeCardId}
      />
    </>
  );
}

export default ListCards;
