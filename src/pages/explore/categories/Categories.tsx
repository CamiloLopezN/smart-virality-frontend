import type {IPills} from "../../../utils/types/exploreTypes.ts";
import {useNavigate} from "react-router";

interface ICategoriesProps {
    pills: IPills[];
}

function Categories({pills}: ICategoriesProps) {
    const navigate = useNavigate();

    const getPill = async (pill: IPills) => {
        navigate(`/explore/topics/${pill.fit_id}`);
    }

    return (
        <div className={'flex flex-row items-center w-full'}>
            <div className='flex flex-row items-center gap-6 overflow-x-auto py-2'>
                {pills && pills.length > 0 && pills.map((category) => (
                    <button
                        key={category.fit_id}
                        type="button"
                        onClick={() => getPill(category)}
                        className="cursor-pointer w-auto text-white bg-blue-700 hover:bg-blue-800
                        focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm text-center
                        dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 whitespace-nowrap"
                    >
                        {category.name}
                    </button>

                ))}
            </div>
        </div>
    );
}

export default Categories;