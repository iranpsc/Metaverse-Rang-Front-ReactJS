// تب «ورود» (مجوز ورود) در صفحه‌ی ملک که بین نمایش اطلاعات (EnterInfo) و ویرایش آن (EnterEdit) جابه‌جا می‌شود و وضعیت پرداخت را نگه می‌دارد؛ مالک ملک از ابتدا پرداخت‌شده حساب می‌شود؛ فعلاً با داده‌ی نمونه کار می‌کند

import { useState } from "react";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { MdOutlineHome } from "react-icons/md";
import EnterEdit from "./EnterEdit";
import EnterInfo from "./EnterInfo";
import { COLOR_CONFIG } from "../../../../services/constants/colorConfig";
import Psc from "../../../../components/Psc";
import Rial from "../../../../components/Rial";
// داده‌ی نمونه؛ ویدیوها فعلاً همان گیف ریال هستند
const PLACEHOLDER_VIDEO = COLOR_CONFIG.irr.gif;

const ENTER_DATA = [
  {
    id: 1,
    inputs: [
      {
        id: 1,
        title: "253",
        label: "47",

        value: "20",

        slug: "psc",
        type: "number",
        icon: COLOR_CONFIG.psc.gif,
        suffix:<Psc/>
      },
      {
        id: 2,
        title: "253",
        label: "48",

        value: "300000",
        slug: "rial",
        type: "number",
        icon: COLOR_CONFIG.irr.gif,
                suffix:<Rial/>

      },
      {
        id: 3,
        title: "534",
        value: "QA31-10789",
        slug: "level",
        type: "string",
        icon: <HiOutlineBuildingOffice />,
      },
      {
        id: 14509,
        title: "724",
        icon: <MdOutlineHome />,
        levels: [
          6921,
          "other than this level",
          "same level and higher level",
          "the same level and a lower level",
        ],
        options: [
          14390,
          "journalist",
          "contributor",
          "developer",
          "inspector",
          "merchant",
          "lawyer",
          "city council members",
          "mayor",
          "governor",
          "minister",
          "judge",
          "legislator",
        ],
      },
      {
        id: 5,
        about:
          "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی در شصت و سه درصد گذشته حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد",
      },
    ],
    videos: Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      video: PLACEHOLDER_VIDEO,
    })),
  },
];

const EnterTab = ({ owner }) => {
  const [data, setData] = useState(ENTER_DATA);
  const [edit, setEdit] = useState(false);
  const [payed, setPayed] = useState(Boolean(owner));

  return edit ? (
    <EnterEdit
      data={data}
      setData={setData}
      setEdit={setEdit}
      payed={payed}
      setPayed={setPayed}
    />
  ) : (
    <EnterInfo
      data={data}
      setEdit={setEdit}
      payed={payed}
      setPayed={setPayed}
      isOwner={owner}
    />
  );
};

export default EnterTab;
