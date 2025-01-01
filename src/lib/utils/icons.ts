interface SVGoptions {
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  strokeLinecap?: string
  strokeLinejoin?: string
}

const DEFAULT_SVG_OPTIONS: SVGoptions = {
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function svgTemplate(inner: string, options: SVGoptions = DEFAULT_SVG_OPTIONS) {
  const {
    width = 24,
    height = 24,
    fill = 'none',
    stroke = 'currentColor',
    strokeWidth = 2,
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
  } = options
  return ` <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 24 24"
      fill="${fill}"
      stroke="${stroke}"
      stroke-width="${strokeWidth}"
      stroke-linecap="${strokeLinecap}"
      stroke-linejoin="${strokeLinejoin}"
    >
      ${inner}
    </svg>`
}

export const icons = {
  bug: (cfg?: SVGoptions) =>
    svgTemplate(
      ` <path d="m8 2 1.88 1.88" />
        <path d="M14.12 3.88 16 2" />
        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
        <path
          d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"
        />
        <path d="M12 20v-9" />
        <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
        <path d="M6 13H2" />
        <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
        <path d="M22 13h-4" />
        <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />`,
      cfg,
    ),
  pallete: (cfg?: SVGoptions) =>
    svgTemplate(
      `<circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
      />`,
      cfg,
    ),

  user: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
      cfg,
    ),

  logout: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />`,
      cfg,
    ),

  login: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />`,
      cfg,
    ),

  cart: (cfg?: SVGoptions) =>
    svgTemplate(
      `<circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path
            d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
        />`,
      cfg,
    ),

  home: (cfg?: SVGoptions) =>
    svgTemplate(
      ` <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path
            d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        />`,
      cfg,
    ),

  box: (cfg?: SVGoptions) =>
    svgTemplate(
      `      <path d="m7.5 4.27 9 5.15" />
      <path
        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
      />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />`,
      cfg,
    ),

  table: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />`,
      cfg,
    ),

  search: (cfg?: SVGoptions) =>
    svgTemplate(
      `<circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />`,
      cfg,
    ),

  chart: {
    bar: (cfg?: SVGoptions) =>
      svgTemplate(
        `<path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />`,
        cfg,
      ),
    line: (cfg?: SVGoptions) =>
      svgTemplate(`<path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />`, cfg),
  },

  warning: (cfg?: SVGoptions) =>
    svgTemplate(
      `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />`,
      cfg,
    ),
  trash: (cfg?: SVGoptions) =>
    svgTemplate(
      `
<path d="M3 6h18" />
  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  <line x1="10" x2="10" y1="11" y2="17" />
  <line x1="14" x2="14" y1="11" y2="17" />`,
      cfg,
    ),
  plus: (cfg?: SVGoptions) =>
    svgTemplate(
      `
  <path d="M5 12h14" />
  <path d="M12 5v14" />`,
      cfg,
    ),
  print: (cfg?: SVGoptions) =>
    svgTemplate(
      `
     <path
    d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
  />
  <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
  <rect x="6" y="14" width="12" height="8" rx="1" />`,
      cfg,
    ),
  x: (cfg?: SVGoptions) =>
    svgTemplate(
      `
         <path d="M18 6 6 18" />
  <path d="m6 6 12 12" />`,
      cfg,
    ),
  minus: (cfg?: SVGoptions) =>
    svgTemplate(
      `
           <path d="M5 12h14"></path>`,
      cfg,
    ),
  dolar: (cfg?: SVGoptions) =>
    svgTemplate(
      `
             <line x1="12" x2="12" y1="2" y2="22"></line>
<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>`,
      cfg,
    ),
  basket: (cfg?: SVGoptions) =>
    svgTemplate(
      `
               <path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>`,
      cfg,
    ),

  edit: (cfg?: SVGoptions) =>
    svgTemplate(
      `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`,
      cfg,
    ),
  save: (cfg?: SVGoptions) =>
    svgTemplate(
      `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>`,
      cfg,
    ),
  back: (cfg?: SVGoptions) =>
    svgTemplate(
      `
<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-undo-2"
      >
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
      </svg>`,
      cfg,
    ),
  cashColor: (cfg?: SVGoptions) =>
    svgTemplate(
      `
 <svg viewBox="0 -196 1416 1416" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M324.358919 22.140541H1361.643243c18.819459 0 33.210811 14.391351 33.210811 33.21081v645.396757c0 18.819459-14.391351 33.210811-33.210811 33.210811H324.358919c-18.819459 0-33.210811-14.391351-33.210811-33.210811V55.351351c0-18.819459 14.391351-33.210811 33.210811-33.21081z" fill="#9DBE87"></path><path d="M1361.643243 756.099459H324.358919c-30.996757 0-55.351351-24.354595-55.351351-55.351351V55.351351c0-30.996757 24.354595-55.351351 55.351351-55.351351H1361.643243c30.996757 0 55.351351 24.354595 55.351352 55.351351v645.396757c0 29.88973-24.354595 55.351351-55.351352 55.351351zM324.358919 44.281081c-6.642162 0-11.07027 4.428108-11.07027 11.07027v645.396757c0 6.642162 4.428108 11.07027 11.07027 11.07027H1361.643243c6.642162 0 11.07027-4.428108 11.070271-11.07027V55.351351c0-6.642162-4.428108-11.07027-11.070271-11.07027H324.358919z" fill="#131313"></path><path d="M230.261622 116.237838h1038.391351c18.819459 0 33.210811 14.391351 33.210811 33.210811v645.396756c0 18.819459-14.391351 33.210811-33.210811 33.210811H230.261622c-18.819459 0-33.210811-14.391351-33.210811-33.210811V149.448649c0-18.819459 14.391351-33.210811 33.210811-33.210811z" fill="#9DBE87"></path><path d="M1267.545946 850.196757H230.261622c-30.996757 0-55.351351-24.354595-55.351352-55.351352V149.448649c0-30.996757 24.354595-55.351351 55.351352-55.351352h1038.391351c30.996757 0 55.351351 24.354595 55.351351 55.351352v645.396756c-1.107027 29.88973-25.461622 55.351351-56.458378 55.351352zM230.261622 138.378378c-6.642162 0-11.07027 4.428108-11.070271 11.070271v645.396756c0 6.642162 4.428108 11.07027 11.070271 11.070271h1038.391351c6.642162 0 11.07027-4.428108 11.07027-11.070271V149.448649c0-6.642162-4.428108-11.07027-11.07027-11.070271H230.261622z" fill="#131313"></path><path d="M143.913514 208.121081h1038.391351c18.819459 0 33.210811 14.391351 33.210811 33.210811v645.396757c0 18.819459-14.391351 33.210811-33.210811 33.21081H143.913514c-18.819459 0-33.210811-14.391351-33.210811-33.21081V241.331892c0-17.712432 14.391351-33.210811 33.210811-33.210811z" fill="#9DBE87"></path><path d="M1182.304865 942.08H143.913514c-30.996757 0-55.351351-24.354595-55.351352-55.351351V241.331892c0-30.996757 24.354595-55.351351 55.351352-55.351351h1038.391351c30.996757 0 55.351351 24.354595 55.351351 55.351351v645.396757c0 29.88973-25.461622 55.351351-55.351351 55.351351zM143.913514 230.261622c-6.642162 0-11.07027 4.428108-11.070271 11.07027v645.396757c0 6.642162 4.428108 11.07027 11.070271 11.07027h1038.391351c6.642162 0 11.07027-4.428108 11.07027-11.07027V241.331892c0-6.642162-4.428108-11.07027-11.07027-11.07027H143.913514z" fill="#131313"></path><path d="M55.351351 290.041081h1038.391352c18.819459 0 33.210811 14.391351 33.210811 33.210811v645.396757c0 18.819459-14.391351 33.210811-33.210811 33.21081H55.351351c-18.819459 0-33.210811-14.391351-33.21081-33.21081V323.251892c0-17.712432 14.391351-33.210811 33.21081-33.210811z" fill="#9DBE87"></path><path d="M1093.742703 1024H55.351351c-30.996757 0-55.351351-24.354595-55.351351-55.351351V323.251892c0-30.996757 24.354595-55.351351 55.351351-55.351351h1038.391352c30.996757 0 55.351351 24.354595 55.351351 55.351351v645.396757c0 30.996757-25.461622 55.351351-55.351351 55.351351zM55.351351 312.181622c-6.642162 0-11.07027 4.428108-11.07027 11.07027v645.396757c0 6.642162 4.428108 11.07027 11.07027 11.07027h1038.391352c6.642162 0 11.07027-4.428108 11.07027-11.07027V323.251892c0-6.642162-4.428108-11.07027-11.07027-11.07027H55.351351z" fill="#131313"></path><path d="M954.257297 902.227027H194.836757c0-52.03027-43.174054-95.204324-95.204325-95.204324V472.700541c52.03027 0 95.204324-43.174054 95.204325-95.204325h759.42054c0 52.03027 43.174054 95.204324 95.204325 95.204325v334.322162c-53.137297 0-95.204324 43.174054-95.204325 95.204324z" fill="#D6F0C5"></path><path d="M954.257297 924.367568H194.836757c-12.177297 0-22.140541-9.963243-22.140541-22.140541 0-39.852973-33.210811-73.063784-73.063784-73.063784-12.177297 0-22.140541-9.963243-22.14054-22.14054V472.700541c0-12.177297 9.963243-22.140541 22.14054-22.140541 39.852973 0 73.063784-33.210811 73.063784-73.063784 0-12.177297 9.963243-22.140541 22.140541-22.14054h759.42054c12.177297 0 22.140541 9.963243 22.140541 22.14054 0 39.852973 33.210811 73.063784 73.063784 73.063784 12.177297 0 22.140541 9.963243 22.14054 22.140541v334.322162c0 12.177297-9.963243 22.140541-22.14054 22.14054-39.852973 0-73.063784 33.210811-73.063784 73.063784 0 12.177297-9.963243 22.140541-22.140541 22.140541z m-739.494054-44.281082h718.460541c8.856216-46.495135 46.495135-84.134054 92.99027-92.99027V492.627027c-46.495135-8.856216-84.134054-46.495135-92.99027-92.99027H214.763243c-8.856216 46.495135-46.495135 84.134054-92.99027 92.99027V785.989189c46.495135 9.963243 84.134054 47.602162 92.99027 94.097297z" fill="#131313"></path><path d="M576.761081 790.417297c-35.424865 0-73.063784-13.284324-99.632432-47.602162-7.749189-9.963243-5.535135-23.247568 3.321081-30.996757 9.963243-7.749189 23.247568-5.535135 30.996756 3.321081 26.568649 34.317838 67.528649 35.424865 94.097298 26.568649 22.140541-7.749189 35.424865-22.140541 35.424865-37.638919 0-14.391351-34.317838-24.354595-64.207568-33.210811-46.495135-14.391351-105.167568-30.996757-105.167567-86.348108 0-26.568649 16.605405-50.923243 45.388108-65.314594 35.424865-17.712432 95.204324-24.354595 151.662702 16.605405 9.963243 7.749189 12.177297 21.033514 4.428108 30.996757-7.749189 9.963243-21.033514 12.177297-30.996756 4.428108-37.638919-27.675676-79.705946-26.568649-105.167568-13.284324-13.284324 6.642162-22.140541 16.605405-22.14054 26.568648 0 21.033514 30.996757 30.996757 73.063783 44.281081 45.388108 13.284324 95.204324 28.782703 95.204325 75.277838 0 34.317838-25.461622 65.314595-65.314595 79.705946-11.07027 3.321081-26.568649 6.642162-40.96 6.642162z" fill="#131313"></path><path d="M574.547027 549.085405c-12.177297 0-22.140541-9.963243-22.140541-22.14054v-48.709189c0-12.177297 9.963243-22.140541 22.140541-22.140541s22.140541 9.963243 22.140541 22.140541v48.709189c0 13.284324-9.963243 22.140541-22.140541 22.14054z" fill="#131313"></path><path d="M574.547027 832.484324c-12.177297 0-22.140541-9.963243-22.140541-22.14054v-36.531892c0-12.177297 9.963243-22.140541 22.140541-22.140541s22.140541 9.963243 22.140541 22.140541v36.531892c0 12.177297-9.963243 22.140541-22.140541 22.14054z" fill="#131313"></path><path d="M285.612973 653.145946m-40.96 0a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 1 0-81.92 0Z" fill="#AECD99"></path><path d="M285.612973 715.139459c-34.317838 0-63.100541-27.675676-63.100541-63.10054s27.675676-63.100541 63.100541-63.100541c34.317838 0 63.100541 27.675676 63.100541 63.100541s-28.782703 63.100541-63.100541 63.10054z m0-80.812973c-9.963243 0-18.819459 7.749189-18.819459 18.81946s7.749189 18.819459 18.819459 18.819459c9.963243 0 18.819459-7.749189 18.819459-18.819459s-8.856216-18.819459-18.819459-18.81946z" fill="#131313"></path><path d="M865.695135 653.145946m-40.96 0a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 1 0-81.92 0Z" fill="#AECD99"></path><path d="M865.695135 715.139459c-34.317838 0-63.100541-27.675676-63.10054-63.10054s27.675676-63.100541 63.10054-63.100541c34.317838 0 63.100541 27.675676 63.100541 63.100541s-28.782703 63.100541-63.100541 63.10054z m0-80.812973c-9.963243 0-18.819459 7.749189-18.819459 18.81946s7.749189 18.819459 18.819459 18.819459 18.819459-7.749189 18.81946-18.819459-8.856216-18.819459-18.81946-18.81946z" fill="#131313"></path></g></svg>`,
      cfg,
    ),

  paid: (cfg?: SVGoptions) =>
    svgTemplate(
      `
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="76.988" y="15.272" style="fill:#CFF09E;" width="358.002" height="120.448"></rect> <g> <path style="fill:#507C5C;" d="M435.005,0H76.995C68.56,0,61.723,6.839,61.723,15.272v452.691c0,13.834,8.258,26.191,21.038,31.484 c12.78,5.29,27.356,2.393,37.137-7.389c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.79,2.367,16.086,6.663 C165.365,505.353,182.827,512,200.291,512s34.927-6.647,48.221-19.941c5.964-5.964,5.964-15.634,0-21.6 c-5.964-5.962-15.634-5.962-21.6,0c-14.678,14.678-38.564,14.678-53.243,0c-20.78-20.778-54.591-20.78-75.371,0.002 c-1.11,1.106-2.407,1.364-3.85,0.765c-1.448-0.6-2.181-1.697-2.181-3.264V150.991h327.464v316.972c0,1.565-0.733,2.664-2.181,3.264 c-1.449,0.599-2.741,0.344-3.85-0.767c-20.778-20.777-54.59-20.778-75.371,0l-12.096,12.096c-5.964,5.964-5.964,15.634,0,21.6 c5.964,5.962,15.634,5.962,21.6,0l12.096-12.096c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.789,2.367,16.086,6.663 c9.782,9.782,24.361,12.682,37.138,7.387c12.778-5.293,21.036-17.652,21.036-31.483V15.272C450.277,6.839,443.44,0,435.005,0z M92.268,120.446V30.545h327.464v89.901L92.268,120.446L92.268,120.446z"></path> <path style="fill:#507C5C;" d="M373.44,272.152h-84.516c-8.435,0-15.272-6.839-15.272-15.272c0-8.433,6.837-15.272,15.272-15.272 h84.516c8.435,0,15.272,6.839,15.272,15.272C388.712,265.313,381.875,272.152,373.44,272.152z"></path> <path style="fill:#507C5C;" d="M373.44,356.151h-84.516c-8.435,0-15.272-6.839-15.272-15.272c0-8.433,6.837-15.272,15.272-15.272 h84.516c8.435,0,15.272,6.839,15.272,15.272C388.712,349.312,381.875,356.151,373.44,356.151z"></path> <path style="fill:#507C5C;" d="M227.402,293.462c-5.636-3.898-15.158-7.76-29.044-11.772v-38.471 c4.412,1.119,7.739,3.517,10.078,7.227c1.86,3.027,3.006,6.656,3.404,10.785c0.266,2.74,2.569,4.831,5.321,4.831h17.336 c1.442,0,2.822-0.582,3.829-1.616c1.006-1.032,1.553-2.427,1.515-3.869c-0.327-12.607-4.599-22.994-12.698-30.873 c-6.976-6.781-16.642-11.021-28.784-12.633v-8.239c0-2.952-2.393-5.345-5.345-5.345h-9.48c-2.952,0-5.345,2.393-5.345,5.345v8.189 c-12.342,1.139-22.331,5.784-29.748,13.844c-8.287,9.021-12.488,19.416-12.488,30.893c0,12.858,4.056,23.106,12.029,30.433 c6.773,6.315,16.922,11.042,30.206,14.081v43.803c-6.245-1.474-10.547-4.463-13.07-9.053c-1.338-2.448-3.07-7.499-3.72-17.66 c-0.18-2.815-2.514-5.003-5.335-5.003h-17.504c-2.952,0-5.345,2.393-5.345,5.345c0,12.571,2.05,22.319,6.251,29.778 c7.216,12.962,20.23,20.633,38.723,22.84v12.604c0,2.952,2.393,5.345,5.345,5.345h9.48c2.952,0,5.345-2.393,5.345-5.345v-12.791 c10.523-1.591,18.947-4.392,25.103-8.354c13.165-8.528,19.785-22.733,19.677-42.187 C243.138,311.508,237.845,300.698,227.402,293.462z M164.537,260.618c0-4.29,1.489-8.388,4.534-12.507 c1.903-2.54,4.957-4.264,9.118-5.151v33.874c-3.549-1.258-6.531-2.883-8.896-4.849 C166.048,269.235,164.537,265.625,164.537,260.618z M198.358,311.528c4.993,1.743,7.752,3.248,9.263,4.318 c4.731,3.352,6.935,7.984,6.935,14.575c0,4.325-0.892,8.039-2.734,11.366c-2.642,4.805-7.073,7.778-13.463,9.008v-39.265H198.358z"></path> </g> </g></svg>`,
      cfg,
    ),

  divide: (cfg?: SVGoptions) =>
    svgTemplate(
      `
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-divide"><circle cx="12" cy="6" r="1"/><line x1="5" x2="19" y1="12" y2="12"/><circle cx="12" cy="18" r="1"/></svg>`,
      cfg,
    ),
    fiado: (cfg?: SVGoptions) =>
      svgTemplate(
        `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`,
        cfg,
      ),
  flags: {
    getEmojiFlag: (lang: string) => {
      switch (lang) {
        case 'en':
          return '🇺🇸'
        case 'pt':
          return '🇧🇷'
        case 'zh':
          return '🇨🇳'
        case 'es':
          return '🇪🇸'
        case 'fr':
          return '🇫🇷'
        case 'de':
          return '🇩🇪'
        case 'ja':
          return '🇯🇵'
        case 'ko':
          return '🇰🇷'
        case 'ru':
          return '🇷🇺'
        default:
          return '🌐'
      }
    },
  },

  arrows: {
    left_line: (cfg?: SVGoptions) =>
      svgTemplate(
        ` <path d="m9 6-6 6 6 6" />
  <path d="M3 12h14" />
  <path d="M21 19V5" />`,
        cfg,
      ),
    down_line: (cfg? : SVGoptions) =>
      svgTemplate(
        `<path d="M8 18L12 22L16 18"/><path d="M12 2V22"/>`,
        cfg,
      ),
    up_line: (cfg? : SVGoptions) =>
      svgTemplate(
        `<path d="M8 6L12 2L16 6"/><path d="M12 2V22"/>`,
        cfg,
      ),
  },
}
