// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="introduction.html">Introduction</a></li><li class="chapter-item expanded "><a href="overview.html"><strong aria-hidden="true">1.</strong> Overview</a></li><li class="chapter-item expanded "><a href="services/overview.html"><strong aria-hidden="true">2.</strong> Remote Attestation Services</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="services/architecture.html"><strong aria-hidden="true">2.1.</strong> Architecture</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="submods/docs/musings/device-and-supply-chain-modelling.html"><strong aria-hidden="true">2.1.1.</strong> Device and Supply Chain modelling</a></li><li class="chapter-item expanded "><a href="submods/docs/musings/queries.html"><strong aria-hidden="true">2.1.2.</strong> Endorsement Queries</a></li><li class="chapter-item expanded "><a href="submods/docs/musings/token-assumptions.html"><strong aria-hidden="true">2.1.3.</strong> Attestation Tokens</a></li><li class="chapter-item expanded "><a href="submods/docs/musings/verification-machine.html"><strong aria-hidden="true">2.1.4.</strong> Verification Machinery</a></li><li class="chapter-item expanded "><a href="submods/docs/musings/veraison-in-a-tee.html"><strong aria-hidden="true">2.1.5.</strong> Veraison in a TEE</a></li></ol></li><li class="chapter-item expanded "><a href="services/deployments/overview.html"><strong aria-hidden="true">2.2.</strong> Deployments</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="services/deployments/aws.html"><strong aria-hidden="true">2.2.1.</strong> aws</a></li><li class="chapter-item expanded "><a href="services/deployments/debian.html"><strong aria-hidden="true">2.2.2.</strong> debian</a></li><li class="chapter-item expanded "><a href="services/deployments/docker.html"><strong aria-hidden="true">2.2.3.</strong> docker</a></li><li class="chapter-item expanded "><a href="services/deployments/native.html"><strong aria-hidden="true">2.2.4.</strong> native</a></li><li class="chapter-item expanded "><a href="services/deployments/rpm.html"><strong aria-hidden="true">2.2.5.</strong> rpm</a></li></ol></li><li class="chapter-item expanded "><a href="services/configuration.html"><strong aria-hidden="true">2.3.</strong> Configuration</a></li><li class="chapter-item expanded "><a href="services/schemes/overview.html"><strong aria-hidden="true">2.4.</strong> Attestation Schemes</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="services/schemes/psa_and_cca.html"><strong aria-hidden="true">2.4.1.</strong> Arm PSA and CCA</a></li><li class="chapter-item expanded "><a href="services/schemes/dice.html"><strong aria-hidden="true">2.4.2.</strong> DICE</a></li></ol></li><li class="chapter-item expanded "><a href="services/policies.html"><strong aria-hidden="true">2.5.</strong> Policies</a></li><li class="chapter-item expanded "><a href="services/api/overview.html"><strong aria-hidden="true">2.6.</strong> API</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="services/api/provisioning.html"><strong aria-hidden="true">2.6.1.</strong> Provisioning</a></li><li class="chapter-item expanded "><a href="services/api/verification.html"><strong aria-hidden="true">2.6.2.</strong> Challenge/Response</a></li><li class="chapter-item expanded "><a href="services/api/management.html"><strong aria-hidden="true">2.6.3.</strong> Policy Management</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="provisioning.html"><strong aria-hidden="true">3.</strong> Endorsement and Reference Value Provisioning</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="extending-corim.html"><strong aria-hidden="true">3.1.</strong> Extending CoRIM</a></li></ol></li><li class="chapter-item expanded "><a href="attestation_result.html"><strong aria-hidden="true">4.</strong> Attestation Results</a></li><li class="chapter-item expanded "><a href="submods/docs/musings/endorsement-api.html"><strong aria-hidden="true">5.</strong> Endorsement Distribution API</a></li><li class="chapter-item expanded "><a href="ratsd.html"><strong aria-hidden="true">6.</strong> Conceptual Message Collection Daemon</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
