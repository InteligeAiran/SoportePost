<div class="min-height-300 bg-dark position-absolute w-100"></div>
<aside>
    <div class="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 "
    id="sidenav-main">
    <div class="sidenav-header">
        <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            aria-hidden="true" id="iconSidenav"></i>
        <a class="navbar-brand m-0" href=" https://demos.creative-tim.com/argon-dashboard/pages/dashboard.html "
            target="_blank">
            <img src="<?php echo APP;?>app/public/img/login/Logo.png" width="26px" height="26px"
                class="navbar-brand-img h-100" alt="main_logo">
            <span style="color:#fff;" class="ms-1 font-weight-bold">Airan Bracamonte</span><br>
            <span style="color:#fff;" class="ms-5 font-weight-bold">SuperAdmin<br>

        </a>
    </div>
    <hr class="horizontal dark mt-0">
    <div class="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link active" href="../pages/dashboard.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white"
                        class="bi bi-laptop" viewBox="0 0 16 16">
                        <path
                            d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5" />
                    </svg>
                    <span class="nav-link-text ms-3">Inicio</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link " href="../pages/tables.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                    <span class="nav-link-text ms-3">Consultas</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link " href="../pages/billing.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-file-earmark-spreadsheet-fill" viewBox="0 0 16 16">
                        <path d="M6 12v-2h3v2z"/>
                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M3 9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2H3z"/>
                    </svg>
                    <span class="nav-link-text ms-3">Reposrtes</span>
                </a>
            </li>
            <li class="nav-item mt-3">
                <h6 style="color:#fff;" class="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
                    Account pages</h6>
            </li>
            <li class="nav-item">
                <a class="nav-link " href="../pages/profile.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                    </svg>            
                    <span class="nav-link-text ms-3">Registrar Usuarios</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link " href="../pages/sign-in.html">
                    <div
                        class="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                        <i class="ni ni-single-copy-04 text-dark text-sm opacity-10"></i>
                    </div>
                    <span class="nav-link-text ms-1">Sign In</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link " href="../pages/sign-up.html">
                    <div
                        class="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                        <i class="ni ni-collection text-dark text-sm opacity-10"></i>
                    </div>
                    <span class="nav-link-text ms-1">Sign Up</span>
                </a>
            </li>
        </ul>
    </div>
    <div class="sidenav-footer mx-3 ">
        <div class="card card-plain shadow-none" id="sidenavCard">
            <img class="w-50 mx-auto"
                src="<?php echo APP;?>app/public/img/dashboard/illustrations/icon-documentation.svg"
                alt="sidebar_illustration">
            <div class="card-body text-center p-3 w-100 pt-0">
                <div class="docs-info">
                    <h6 style= "color: white;" class="mb-0">Need help?</h6>
                </div>
            </div>
        </div>
    </div>
</aside>
