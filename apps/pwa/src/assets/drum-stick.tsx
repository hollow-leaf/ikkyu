export default function DrumStick({
  className,
  style,
}: {
  className?: string;
  style: React.CSSProperties;
}) {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 314.001 314.001"
      xmlSpace="preserve"
      className={className}
    >
      <path d="M43.394,50.136c-1.257-2.073-3.518-3.372-5.986-3.372c-0.102,0.001-0.197,0.003-0.296,0.002c-5.24,0-11.101-2.739-15.719-7.357 c-3.895-3.894-6.515-8.782-7.191-13.412c-0.332-2.279-0.461-6.532,2.419-9.407c2.875-2.877,7.129-2.748,9.413-2.416 c4.631,0.675,9.519,3.294,13.409,7.186c4.678,4.677,7.426,10.629,7.352,15.922c-0.032,2.264,1.051,4.343,2.815,5.658l97.33,94.328 l-9.852,9.549L43.394,50.136z"></path>
    </svg>
  );
}
