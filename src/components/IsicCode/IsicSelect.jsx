import { useMemo, useState } from "react";
import TagsSelect from "./TagsSelect";
import useIsicCodes from "../../hooks/useIsicCodes";
import { getTranslation } from "../../services/Utility";

const MAX_ACTIVITIES = 3;

const IsicSelect = ({ value, onChange }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // فقط وقتی لیست بازه درخواست میزنه
  const { options, loading, loadMore } = useIsicCodes(search, open);

  const items = useMemo(
    () => options.map((o) => ({ id: o.id, label: o.name })),
    [options],
  );

  return (
    <TagsSelect
      value={value}
      onChange={onChange}
      options={items}
      loading={loading}
      max={MAX_ACTIVITIES}
      placeholder={getTranslation("360")}
      emptyText="موردی یافت نشد"
      onSearchChange={setSearch}
      onOpenChange={setOpen}
      onLoadMore={loadMore}
    />
  );
};

export default IsicSelect;