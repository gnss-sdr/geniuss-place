---
title: "GNSS-SDR v0.0.22 released"
excerpt: "GNSS-SDR v0.0.22 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2026-10-03T08:54:02+02:00
---

GNSS-SDR v0.0.22 is a major step forward for the project. The receiver now
processes four new signals: BeiDou B1C and B2a, QZSS L1 C/B, and SBAS L1 (EGNOS
and WAAS, not yet used as ranging sources). The PVT block gains real-time
kinematic (RTK) positioning fed by RTCM 3 corrections from NTRIP casters,
enabling centimeter-level relative positioning under suitable observing
conditions, together with a new integer ambiguity resolution management layer.
Observation and navigation files can now be written in RINEX 4.02 format, and a
new CUDA acquisition engine can offload the PCPS search grid to NVIDIA GPUs,
including Jetson platforms. Support for RF hardware grows with new signal
sources for bladeRF (without going through gr-osmosdr), Pocket SDR, and
SAPHYRION EVK1029 front-ends, and the Galileo OSNMA implementation now handles
chain, public key, and Merkle tree renewals and revocations, as well as alert
messages. This release also fixes several biases in the group-delay and
ionospheric corrections applied by the single-point positioning solver.

Many of these features are community contributions, credited in the list below.
The most relevant changes with respect to the former release are:

## Improvements in [Accuracy]({{ "/design-forces/accuracy/" | relative_url }}):

- Added real-time kinematic (RTK) positioning using RTCM 3 corrections received
  from NTRIP casters, enabling centimeter-level relative positioning under
  suitable observing conditions.
- Fixed the sign of the group-delay correction applied to GPS and QZSS L1+L2C
  dual-band observations in the SPP solver when a single-frequency ionospheric
  model is used: the L1 C/A pseudorange is now corrected as `P1 - c*TGD`, as
  specified in IS-GPS-200 20.3.3.3.3.2, instead of `P1 + c*TGD`, removing a
  per-satellite bias of twice the broadcast group delay (up to several meters).
- Fixed the GPS L1+L5 dual-frequency ionosphere-free correction in the SPP
  solver: the gamma-weighted L1 term now applies `ISC_L1C/A` as specified in
  IS-GPS-705 20.3.3.3.1.2.2, instead of erroneously reusing `ISC_L5I5` on both
  terms of the combination.
- The variance of the broadcast ionospheric delay estimate is now scaled
  consistently with the delay itself when converting from the GPS L1 frequency
  to the L1/B1 frequency of other constellations (delay scales with f^-2, its
  variance with f^-4).
- Fixed a double-counting of the ionospheric delay in the Single Point
  Positioning (SPP) solver for dual-band satellites processed with a
  single-frequency ionospheric model (e.g., `PVT.iono_model=Broadcast`): the
  ionosphere-free pseudorange combinations formed for GPS/QZSS L1+L5 and
  Galileo/GLONASS/BeiDou dual-band observations no longer get the modeled
  ionospheric delay applied on top, which biased those residuals by the
  (elevation-dependent) modeled delay. The measurement variance of these
  combinations now also receives the same noise-amplification factor already
  used in the ionosphere-free positioning mode, instead of a Klobuchar-based
  variance term that did not correspond to the measurement.
- The modeled ionospheric delay in the SPP solver is now scaled to the observed
  frequency band for single-band measurements outside the L1/E1/B1 band (GPS
  L2C-only or L5-only, Galileo E5a-only or E5b-only, GLONASS L2-only, BeiDou
  B3I-only): the L1 delay is multiplied by (f_L1/f_band)^2 (about 1.65 for L2
  and 1.79 for L5/E5a), and its variance by the square of that factor.
  Previously the unscaled L1 delay was applied to those measurements,
  undercorrecting the ionosphere by the same factor.
- Improved PVT processing of GPS L2C, GPS L5, and QZSS signals using CNAV
  navigation data: satellite positions now include the CNAV semi-major axis and
  mean-motion rate terms, and group-delay / inter-signal corrections follow
  IS-GPS-200 / IS-GPS-705 in both single-band and L1+L5 dual-band
  configurations. Contributed by
  [@vladisslav2011](https://github.com/vladisslav2011).
- Carrier-phase discontinuities are now detected and flagged: cycle slips after
  a signal reacquisition, and half-cycle jumps caused by a change in the
  telemetry-resolved phase polarity. RINEX observation files report them with
  standard loss-of-lock indicator values, and the optional carrier smoothing
  filter restarts instead of smoothing across the jump.

## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

- Added `Acquisition_XX.full_grid_search` (default: `false`) for acquisition
  implementations using the CPU PCPS block. When enabled, each search stage
  accumulates all `max_dwells` non-coherent integrations before accepting or
  rejecting the strongest peak. This also applies to both stages of
  `make_two_steps` and to narrowed Doppler searches. The default preserves early
  acceptance; `max_dwells=1` is unchanged. `bit_transition_flag=true` takes
  precedence and still uses a single double-length dwell. Waiting for all dwells
  increases acquisition latency. Contributed by
  [@joebre](https://github.com/joebre).
- Improved TOW rollover handling in Telemetry Decoder blocks.
- Galileo F/NAV and I/NAV ephemerides are now retained independently instead of
  overwriting each other when they have the same PRN. PVT automatically uses the
  ICD-consistent service for the enabled bands (E1/E5a uses F/NAV; E1/E5b uses
  I/NAV, with I/NAV taking priority when E5a and E5b are both enabled), while
  RINEX, RTCM MT1045, monitoring, and assistance-data persistence preserve the
  navigation-message source. XML persistence keeps the legacy
  `gal_ephemeris.xml` view and automatically adds `gal_inav_ephemeris.xml` and
  `gal_fnav_ephemeris.xml`; no configuration change is required.
- Galileo E1 observations can now use the I/NAV ephemeris while F/NAV is still
  being decoded in E1/E5a configurations, with the E1/E5b BGD applied to match
  that clock model, and return to F/NAV once it is available. This removes the
  cold-start delay in which Galileo could not contribute to PVT until F/NAV was
  fully decoded on E5a. E1 can also use Reduced CED in the same situation. E5a,
  E5b and E6 observations always keep the clock reference of their configured
  service. The reverse fallback (E1 using F/NAV when I/NAV is stale) requires
  `use_unhealthy_sats=true`, since F/NAV carries no E1B health information.
- The PVT iono model now decides the pseudorange model for every satellite of a
  system: only `PVT.iono_model=Iono-Free-LC` combines two bands, and any other
  model uses the first band alone with its TGD/BGD (second band alone only when
  the first is missing). Previously a satellite with two bands in the record was
  silently switched to the iono-free combination while single-band satellites of
  the same system kept the single-frequency model, mixing two clock references
  within one solve and folding the receiver's uncalibrated inter-band delay
  (e.g. differing input-filter group delays) into the solution, which could make
  the chi-square test reject every epoch. The ISC-aware GPS L1/L5 combination is
  now applied in `Iono-Free-LC` mode.
- Fixed Galileo single-frequency broadcast group-delay corrections in SPP and
  PPP, selecting the E1/E5a or E1/E5b BGD from the active navigation service and
  applying the ICD frequency scaling to E5a and E5b observations.
- Hardened Galileo I/NAV and F/NAV handling by rejecting alert pages from the
  nominal decoder, validating unavailable GGTO data, and preventing stale Word 5
  data from completing Reduced CED or Reed-Solomon-recovered ephemerides.
- Improved the availability of navigation data by making histogram-based bit
  synchronization more resistant to weak or ambiguous prompt transitions, which
  could select the wrong bit-boundary phase, prevent telemetry frame
  synchronization, and delay TTFF. Candidate edges are now scored with
  normalized coherent prompt averages, require a configurable margin over the
  second-best phase bin, and are validated with fresh matching transition
  events. Histogram stability and tentative-lock validation advance concurrently
  to avoid unnecessary synchronization delay. New configuration parameters are
  `Tracking_1C.bs_runner_up_margin` (default: 0.3),
  `Tracking_1C.bs_transition_window_epochs` (default: 4),
  `Tracking_1C.bs_transition_confidence` (default: 0.6), and
  `Tracking_1C.bs_tentative_events_required` (default: 2).
- Added an optional frequency-refinement scan to help tracking lock onto signals
  whose initial Doppler estimate is displaced by a navigation-bit or
  secondary-code transition during acquisition, particularly Galileo E1. Enable
  it per signal with `Tracking_<Sig>.f_error_step_num` (default: 0, disabled).
  This selects the number of Doppler bins around the acquisition estimate; even
  nonzero values are rounded up to an odd count. `f_error_doppler_step` sets
  their spacing (default: 250 Hz), and `f_error_accumulation` sets the code
  periods accumulated per bin (default: 20; zero is replaced with one, with a
  warning). The scan adds a startup delay of one code period per accumulation
  per bin and supports `high_dyn=true`. The `pull_in_time_s` and
  `bit_synchronization_time_limit_s` budgets start after the scan, allowing the
  tracking loops their full settling time. Contributed by
  [@joebre](https://github.com/joebre).
- Added an optional CSV dump of the frequency-refinement scan, enabled with
  `Tracking_<Sig>.f_error_dump=true` (default: `false`). The tested Doppler
  frequencies, their correlation power, and the selected frequency are written
  to `Tracking_<Sig>.f_error_dump_filename` (default: `./f_error_dump.csv`).
  Channels sharing a filename write to the same file, with scan, satellite and
  channel identifiers; the first scan overwrites any previous file, and later
  scans in the same receiver run append their results. The Octave scripts
  `load_f_error_dump.m`, `find_f_error_scans.m` and `plot_f_error_scan.m` (in
  `utils/matlab/libs`) and `plot_all_f_error_scans.m` (in `utils/matlab`) load
  and plot the dumped scans, and `utils/matlab/libs/f_error_sim.m` provides a
  Monte Carlo simulation of the scan for sizing `f_error_step_num`,
  `f_error_accumulation` and `f_error_doppler_step` without a live capture.

## Improvements in [Efficiency]({{ "/design-forces/efficiency/" | relative_url }}):

- Optimized CPU DLL/PLL VEML tracking for pilot/data signal pairs by computing
  the pilot correlators and the data prompt in one multicorrelator pass. The
  data prompt now reuses the same carrier wipe-off as the pilot correlators
  instead of invoking a separate one-tap correlator, while non-pilot tracking
  keeps the previous correlation path.
- When dual-frequency assistance provides the Doppler of a satellite already
  tracked in the primary band (`GNSS-SDR.assist_dual_frequency_acq=true`), the
  PCPS acquisition in the secondary band now searches a single Doppler bin
  instead of the full grid, and recalibrates the `pfa`-based threshold to the
  number of bins searched. New parameter
  `Acquisition_XX.reference_bin_min_sidelobes` (default: `4`) sets the Doppler
  separation, in correlation sidelobes, that decides whether a full-grid CFAR
  search needs dedicated noise-reference bins. Acquisition `.mat` dumps include
  `doppler_center`, `doppler_narrowed`, and `doppler_num_candidates`: the first
  `doppler_num_candidates` columns of `acq_grid` are Doppler bins at
  `doppler_center - doppler_max + doppler_step * col`, and any remaining columns
  are noise-reference bins. Contributed by [@joebre](https://github.com/joebre).
- Added an optional visibility-aware acquisition search, enabled with
  `GNSS-SDR.enable_visibility_aware_search=true` (default `false`, which leaves
  the existing search order untouched). Once a receiver position is available,
  either from a fix or from `GNSS-SDR.AGNSS_ref_location`, satellites are
  continuously classified as visible, excluded (elevation at or below
  `GNSS-SDR.search_elevation_mask`, default 0 degrees, or flagged unhealthy), or
  not yet known, using the freshest ephemeris or almanac decoded for GPS,
  Galileo, BeiDou, GLONASS, and QZSS. Idle channels then favor visible
  satellites over unknown ones, at the ratio given by
  `GNSS-SDR.visible_vs_mayvisible_search_ratio` (default 3), and skip known
  excluded ones, so less CPU is spent acquiring satellites that are below the
  horizon. The classification is refreshed whenever new navigation data arrives,
  when the receiver moves more than
  `GNSS-SDR.visibility_recompute_position_threshold_m` (default 1000 m), every
  `GNSS-SDR.visibility_recompute_interval_s` (default 120 s), and when almanac
  data becomes older than `GNSS-SDR.visibility_almanac_max_age_s` (default 3
  days). A satellite that is already being tracked is never released because of
  this classification, and `PVT.elevation_mask` still decides which observations
  enter the navigation solution. Contributed by
  [@joebre](https://github.com/joebre).
- Added opt-in almanac/ephemeris Doppler prediction for secondary signals with
  `Acquisition_<signal>.alm_ephe_assisted_doppler_narrowing=true` (default
  `false`, also supported per channel). To acquire secondary signals without
  waiting for a tracked primary band, set
  `GNSS-SDR.assist_dual_frequency_acq=false`. Pre-fix prediction additionally
  requires `GNSS-SDR.doppler_prediction_before_fix=true`, an
  `AGNSS_ref_location` (and `AGNSS_ref_utc_time` for replay), and explicit,
  finite, nonnegative values for both `GNSS-SDR.clock_frequency_max_error_ppm`
  and `GNSS-SDR.receiver_max_velocity_m_s`. Missing or invalid bounds preserve
  the full Doppler search; explicit zero bounds assert no uncertainty in that
  component. The predicted center uses `GNSS-SDR.clock_frequency_offset_ppm`
  (default 0) and zero receiver velocity before a fix. Search widening honors
  `--doppler_max` and `--doppler_step` overrides, and falls back to the regular
  full search centered at 0 Hz when the uncertainty window is not narrower than
  the configured Doppler grid. Live-fix prediction refreshes its timestamp
  before both idle and channel-event acquisition attempts.
- New CUDA acquisition engine: with `-DENABLE_CUDA=ON`, any PCPS acquisition
  block can evaluate its Doppler x code-phase search grid on the GPU with
  batched cuFFTs by setting `Acquisition_XX.use_cuda=true` (or
  `GNSS-SDR.use_cuda_acquisition=true`). Peak search and detection statistics
  are unchanged, so results match the CPU implementation; the block falls back
  to the CPU if the device cannot be initialized. Added `benchmark_pcps_grid`
  (CPU baseline vs. GPU) and unit tests checking the GPU grid against the CPU
  reference and running the full GPS L1 C/A adapter on a real capture.
  Contributed by [@phillipvu](https://github.com/phillipvu).

## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

- Added the BeiDou B1C receiver chain, with signal identifier `1D`: acquisition
  (`BEIDOU_B1C_PCPS_Ambiguous_Acquisition`, with optional QMBOC local replica),
  tracking (`BEIDOU_B1C_DLL_PLL_VEML_Tracking`, tracking the pilot component by
  default), and B-CNAV1 telemetry decoding (`BEIDOU_B1C_Telemetry_Decoder`,
  including LDPC decoding of subframes 2 and 3 and BCH decoding of subframe 1).
  The PVT engine uses the B-CNAV1 ephemeris, clock, and group-delay corrections
  (TGD_B1Cp / ISC_B1Cd), implements the BDGIM ionospheric model broadcast in
  B-CNAV1, and supports both B1C-only and mixed B1I+B1C configurations, keeping
  DNAV and B-CNAV1 ephemerides isolated and preferring B1C over B1I when both
  signals are available from the same satellite. B-CNAV1 ephemerides are also
  written to RINEX navigation files (native CNV1 records in RINEX 4.02, D1-style
  stand-in records in RINEX 3.02) and to the XML assistance-data storage. A
  sample configuration file is provided at
  `conf/File_input/Beidou/gnss-sdr_BDS_B1C_geb_if20k_fs18m_ibyte.conf`.
  Contributed by [@OuWenhao16](https://github.com/OuWenhao16).
- Added the BeiDou B2a RNSS receiver chain (B2a_I data / B-CNAV2), with signal
  identifier `5D`: PCPS acquisition (`BEIDOU_B2A_PCPS_Acquisition`), DLL+PLL
  tracking (`BEIDOU_B2A_DLL_PLL_Tracking`; BPSK(10), 1 ms primary code, data
  component only), and B-CNAV2 telemetry decoding
  (`BEIDOU_B2A_Telemetry_Decoder`), including soft-decision 64-ary LDPC(96,48)
  decoding of the 576 coded bits into 288 information bits before CRC-24Q and
  PRN validation. The decoder reuses the B1C GF(64) arithmetic and fixed-path
  decoder, with a full-alphabet sum-product fallback for B2a. Carrier polarity
  and tracking gain are normalized before decoding. The PVT engine uses B-CNAV2
  ephemeris, clock, and group-delay corrections (TGD_B2ap / ISC_B2ad), and RINEX
  4.02 navigation files contain native CNV2 records. GEO and BDS-2 satellites
  (PRN 1-18 and 59-63) are not assigned B2a channels and are not used in PVT.
  Sample configuration files are provided at
  `conf/File_input/Beidou/gnss-sdr_BDS_B2a_file.conf` and
  `conf/File_input/Beidou/gnss-sdr_BDS_B2a_cu_l5_if20k_fs18m.conf`. Contributed
  by [@huangchuhan](https://github.com/huangchuhan).
- Added support for the QZSS L1 C/B signal (PRNs 203-206), broadcast by
  satellites configured to transmit it in place of L1 C/A. Observables and
  ephemerides from L1 C/B PRNs are attributed to the PRN of the satellite's
  nominal PNT signals in PVT and output products, following the RINEX 4.00
  convention. Contributed by
  [@vladisslav2011](https://github.com/vladisslav2011).
- Added reception of SBAS L1 signals (EGNOS and WAAS, PRN 120-138), with signal
  identifier `S1`: PCPS acquisition (`SBAS_L1_PCPS_Acquisition`), DLL+PLL
  tracking (`SBAS_L1_DLL_PLL_Tracking`), and telemetry decoding
  (`SBAS_L1_Telemetry_Decoder`) with Viterbi FEC decoding, CRC-24Q verification,
  and message-type reporting. Decoded frames carry traceback-corrected reception
  timestamps and can be dumped to per-PRN text files in an EMS-like layout with
  `TelemetryDecoder_S1.dump=true`. SBAS satellites are not used as ranging
  sources yet. A sample configuration file is provided at
  `conf/File_input/SBAS/gnss-sdr_SBAS_EGNOS_rx.conf`. Contributed by
  [@kalmancito](https://github.com/kalmancito).
- Added support for RINEX 4.02 output, activated by setting
  `PVT.rinex_version=4` in the configuration file (or with the
  `-RINEX_version=4.02` command-line flag). Observation files are generated in
  the 4.02 version format, and navigation files make use of the data record
  structure introduced in RINEX 4.00. The default behavior when
  `PVT.rinex_version` is not set remains unchanged (RINEX 3.02).
- Added an opt-in RTK path fed by NTRIP corrections. The PVT block can now
  connect to an NTRIP caster, decode the RTCM 3 base position and base
  observations, and feed time-aligned reference data to its RTKLIB
  relative-positioning solver. Supported receiver configurations, per
  constellation and freely combined: GPS L1 C/A alone or together with L2C or
  L5, Galileo E1 alone or together with E5a, and BeiDou B1C (single-frequency).
  Single-band sets run single-frequency RTK, viable on the short effective
  baselines of VRS services. GPS L5 and Galileo E5a share the same center
  frequency, and BeiDou B1C shares the GPS L1 / Galileo E1 center, so the
  combined GPS L1+L5 / Galileo E1+E5a / BeiDou B1C dual-frequency receiver needs
  only two RF channels, and a single-frequency GPS+Galileo+BeiDou receiver needs
  one. The RTCM 3 MSM decoder gained the BeiDou B1C signal identifiers and
  prefers B1C over B1I when a base station broadcasts both in the shared first
  frequency slot. The client prefers NTRIP v2 and, after a fully-sent v2
  exchange closes or times out before receiving response bytes, or returns HTTP
  400, 501, or 505, retries on a fresh NTRIP v1 connection
  (`PVT.ntrip_version=1` forces the legacy protocol). It supports TLS 1.2 or
  newer with system-CA certificate and hostname verification
  (`PVT.ntrip_tls_enabled=true`). It reconnects without blocking the GNU Radio
  work function, filters station changes and stale corrections, redacts
  credentials from RTKLIB traces, and retains an explicitly labeled single-point
  fallback when configured. VRS and nearest-station mountpoints are supported:
  the client periodically reports the rover position upstream as an NMEA GGA
  sentence (`PVT.ntrip_send_gga`, enabled by default, with the cadence set by
  `PVT.ntrip_gga_period_ms`, 10 s by default), starting as soon as the receiver
  produces its first position solution.
- The ionospheric Klobuchar coefficients and the UTC(NICT) offset parameters
  broadcast by QZSS satellites, both in the L1 C/A LNAV message and in the L5
  CNAV message, are now stored separately from the GPS ones instead of
  overwriting them. This enables the QZUT / QZSS ION RINEX 4 data records (with
  the compulsory `WIDE` subtype for the CNVX Klobuchar set, broadcast in CNAV
  Message Type 30), prevents QZSS-sourced parameters from being mislabeled as
  GPS corrections in mixed GPS + QZSS configurations, feeds the QZSS slots of
  the RTKLIB navigation structure, and adds `qzss_utc_model.xml`,
  `qzss_iono.xml`, `qzss_cnav_utc_model.xml`, and `qzss_cnav_iono.xml` to the
  XML storage output.
- QZSS ambiguities are now resolved in their own group instead of jointly with
  GPS, avoiding integer fixes across the GPS-QZSS inter-system bias, and the
  RTCM 3 decoder accepts the final RTCM 3.3 BeiDou ephemeris message type 1042
  (in addition to the draft type 63), with the a2 clock drift rate term now
  scaled per the BeiDou ICD (2^-66 instead of 2^-55).
- Cycle-slip detection by phase-doppler difference is now available: the
  detector removes the common receiver clock error as the median range-rate
  residual over all satellites before thresholding. It is enabled by setting
  `PVT.slip_threshold_doppler` (in m/s; 0, the default, disables it). The
  innovation rejection threshold in relative positioning and PPP is now split
  between carrier-phase and code observables:
  `PVT.threshold_reject_innovation_phase` complements the existing
  `PVT.threshold_reject_innovation` (which now applies to code) and defaults to
  the same value, so existing configurations behave identically; a value of 5.0
  m for the phase threshold is recommended in RTK modes.
- The double-difference ambiguity transformation now uses the index-based
  formulation, and integer ambiguity resolution is driven by a new management
  layer that can skip AR while the float position variance is still high
  (`PVT.ar_max_position_variance`, default 0.25 m^2; 0 disables the gate),
  reject newly-risen satellites and retry when the AR ratio degrades
  (`PVT.ar_filter`, default true), cycle a single satellite out of AR when no
  fix is achieved with many satellites in view (`PVT.min_drop_sats`, default 10;
  0 disables), scale the AR ratio threshold with the number of ambiguity pairs
  (`PVT.ar_ratio_min`/`PVT.ar_ratio_max`; equal values keep the fixed
  `PVT.min_ratio_to_fix_ambiguity`), and gate fixing and holding on minimum
  satellite counts (`PVT.min_fix_sats`, default 4; `PVT.min_hold_sats`,
  default 5) with a configurable fix-and-hold pseudo-measurement variance
  (`PVT.var_holdamb`, default 0.1 cycle^2). The reference satellite for double
  differencing is now selected by lowest measurement variance instead of highest
  elevation, excluding slipped satellites, which behaves better in urban
  conditions where SNR is a better quality proxy than elevation. Also fixed an
  out-of-bounds risk in the double-difference bias bookkeeping when five
  constellation groups are active.
- Added SNR-dependent and receiver-reported-stdev terms to the observation
  weighting model of the single-point and RTK solvers: `PVT.error_factor_snr`
  (m; a recomended value is 0.005) adds a term driven by the C/N0 of rover and
  base observations relative to `PVT.error_snr_max` (default 52 dB-Hz), and
  `PVT.error_factor_rcv_std` weights observations by receiver-reported
  pseudorange/carrier-phase standard deviations (new `Pstd`/`Lstd` fields in the
  observation structure, ready to be populated from the tracking-loop variance
  estimates). Both terms default to 0.0 (disabled), preserving the
  elevation-only error model.
- The single-point solver can now estimate a separate QZS-GPS inter-system bias
  instead of assuming QZSS shares the GPS receiver clock. The estimated offset
  is reported in `sol.dtr[4]`. It is opt-in via `PVT.estimate_qzss_isb=true`
  (default `false`) because the extra unknown requires one more satellite in
  mixed GPS+QZSS epochs, which degrades availability under limited sky
  visibility; enable it only in open-sky scenarios with six or more satellites
  in view.
- Added a `Bladerf_Signal_Source` for interoperability with Nuand's bladeRF
  front-ends (bladeRF x40, x115, and bladeRF 2.0 Micro xA4/xA9), streaming RX
  samples directly through `libbladeRF` (requires the `-DENABLE_BLADERF=ON`
  building flag) instead of going through `gr-osmosdr`. Supports single-channel
  (SISO) reception, an optional RX bias tee for powering an active antenna on
  the 2.0 Micro, and exposes a single overall RX gain (unlike the `if_gain` /
  `rf_gain` split used by `Osmosdr_Signal_Source`). A sample configuration file
  is provided at `conf/RealTime_input/gnss-sdr_GPS_L1_bladeRF_native.conf`.
  Contributed by [@MrCry0](https://github.com/MrCry0).
- Added a new Signal Source implementation `Pocket_SDR_Signal_Source`, which
  supports
  [Pocket SDR FE](https://www.datagnss.com/products/pocketsdr-gnss-receiver)
  2CH/4CH/8CH GNSS RF front-ends through the
  [`gr-pocketsdr`](https://github.com/minhaj6/gr-pocketsdr) GNU Radio
  out-of-tree module. It requires the `-DENABLE_POCKETSDR=ON` building flag.
  Check the
  [Signal Source documentation](https://gnss-sdr.org/docs/sp-blocks/signal-source/#implementation-pocket_sdr_signal_source).
  Contributed by [@minhaj6](https://github.com/minhaj6).
- Improved support for Keysight (formerly Spirent) GSS6450/GSS6425 format sample
  files. The Signal Source implementation is now named
  [`GSS6450_File_Signal_Source`](https://gnss-sdr.org/docs/sp-blocks/signal-source/#implementation-gss6450_file_signal_source),
  while retaining `Spir_GSS6450_File_Signal_Source` as a backward-compatible
  alias. It can auto-detect `.gns` file layout information, unpack 2-, 4-, 8-,
  and 16-bit samples, and expose multi-channel recordings as independent RF
  output streams.
- Reworked
  [`ION_GSMS_Signal_Source`](https://gnss-sdr.org/docs/sp-blocks/signal-source/#implementation-ion_gsms_signal_source)
  support for ION GNSS SDR metadata files. The source now validates and
  deduplicates requested streams, honors file offsets, block headers/footers,
  and omitted cycle counts, and stops finite captures cleanly with a guarded
  valve tail. Chunk unpacking now handles word endianness, padding, shifts,
  repeated lump patterns, repeated stream IDs, standard integer encodings, and
  FP32 streams as `float` or `gr_complex` outputs.
- Improved `Labsat_Signal_Source` support for LabSat 2, LabSat 3, and LabSat 3
  Wideband recordings, including more robust header parsing, corrected 2-bit
  sample decoding, multi-channel output handling, and unit-test coverage for the
  supported layouts.
- Added an opt-in `EVK1029_Signal_Source` for the SAPHYRION EVK1029, a dual-band
  (E1/E5a) or triple-band (E1/E5a/E6) GNSS evaluation kit built around the
  SY1009 RF front-end and SY1019 ADC/DSP space-grade ASICs. Reads the EVK1029
  host application's raw capture files directly (a continuous, header-less
  stream of OBA-encoded 4-bit samples, two per byte, 16 samples per
  little-endian 64-bit word), without going through the generic
  XML-metadata-driven `ION_GSMS_Signal_Source` path. Disabled by default; build
  with `-DENABLE_EVK1029=ON` to enable it.
- Improved Galileo HAS robustness and ICD compliance, including stricter MT1
  validation, correct cache/Do-Not-Use handling, TOW fallback for E6 HAS pages,
  preserved mask/IOD correction context, and corrected HAS application in
  RTKLIB/PVT.
- Fixed bugs in the generation of RTCM MSM messages.
- Fixed identification of GLONASS satellites.
- Fixed bug in the generation of the spreading code for QZSS L5 PRN 196.
- Improved validation of GPS/QZSS CNAV Clock, Ephemeris, Integrity (CEI)
  dataset.
- Implemented QZSS LNAV almanac/auxiliary pages decoding.
- Hardened BeiDou DNAV and Glonass GNAV decoding.
- Completed BeiDou D1/D2 DNAV decoding, including almanac, time, integrity,
  differential-correction, and ionospheric-grid data, with BeiDou almanacs wired
  into RTKLIB-assisted satellite visibility.
- Corrected RINEX 3/4 navigation and observation output for GPS, QZSS, Galileo,
  and BeiDou, including DNAV metadata and refreshable RINEX 4 ION/STO/EOP
  records. CNAV-only GPS/QZSS configurations now automatically use RINEX 4.02
  for both files, avoiding lossy RINEX 3 navigation records.
- Improved performance of Galileo's Viterbi decoder.
- Fixed edge cases in the retrieving of GPS L1 C/A navigation data.
- Fixed Glonass carrier phase and time annotations in RINEX files.
- Implemented handling of the GLONASS notification of a forthcoming leap second
  event (KP word in the GNAV message), improving timekeeping across leap second
  transitions.
- The NMEA printer now generates QZGSA and QZGSV sentences, reporting the QZSS
  satellites used in the PVT solution and in view (with elevation, azimuth, and
  C/N0), using the QZSS system and signal identifiers defined in NMEA 0183.
  Contributed by [@vladisslav2011](https://github.com/vladisslav2011)
- Fixed NMEA GSV C/N0 reporting for non-L1 configurations, including GPS L2 and
  L5: RTKLIB now preserves per-frequency signal strength and observation-code
  metadata in satellite status, and the NMEA printer emits the strongest
  available C/N0 with the corresponding NMEA signal identifier. Contributed by
  [@vladisslav2011](https://github.com/vladisslav2011).
- The custom output stream defined by `monitor_pvt.proto` now includes a
  `tracked_satellites` list. Each entry reports one tracked signal (`system`,
  `prn`, `signal`), its `azimuth_deg` and `elevation_deg`, whether it was
  `combined` with another signal of the same satellite (e.g., the Galileo E1+E5a
  ionosphere-free combination), and a `used` flag telling whether it contributed
  to the reported fix. Satellites that were tracked but left out of the solution
  (below `PVT.elevation_mask`, or excluded by RAIM) are listed with
  `used = false`. Unhealthy satellites are listed with `healthy = false`.
  Contributed by [@joebre](https://github.com/joebre).

## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

- Refactored main Acquisition, Tracking, and Telemetry Decoder adapters,
  simplifying interfaces and improving consistency across processing chains.
  This reduces code duplication, enhances maintainability, and eases the
  integration of new GNSS signals. Contributed by
  [@MathieuFavreau](https://github.com/MathieuFavreau).
- Merged the GLONASS L1 and L2 C/A telemetry decoder blocks, as well as the
  BeiDou B1I and B3I ones, which were almost identical since each pair of
  signals broadcasts the same navigation message (GNAV and DNAV, respectively),
  into single blocks parameterized by the frequency band, following the approach
  already used for the Galileo telemetry decoder. No changes are required in
  configuration files.

## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

- Refactored Python interpreter detection and improved CMake portability and
  robustness across dependency discovery, distro detection, and
  cross-compilation handling.
- The CUDA build (`-DENABLE_CUDA=ON`) works again with current toolkits and on
  NVIDIA Jetson: removed the hardcoded `sm_30` (Kepler) architecture, which
  CUDA >= 11 rejects; `CMAKE_CUDA_ARCHITECTURES` is now honored and detected
  automatically on Jetson (Orin -> 87, Xavier -> 72, TX2 -> 62, Nano -> 53) or
  set to `native` with CMake >= 3.24; the CUDA language standard follows the
  host C++ standard (C++17); imported `CUDA::cudart`/`CUDA::cufft` targets are
  linked explicitly; `-Wno-psabi` is no longer passed to `nvcc`. Contributed by
  [@phillipvu](https://github.com/phillipvu).
- Added `docs/JETSON.md`, a build/verify/benchmark guide for NVIDIA Jetson.
  Contributed by [@phillipvu](https://github.com/phillipvu).

## Improvements in [Reliability]({{ "/design-forces/reliability/" | relative_url }}):

- Hardened the Galileo OSNMA protocol implementation, adding support for Chain
  Renewal, Chain Revocation, Public Key Renewal, Public Key Revocation, Merkle
  Tree Renewal, and OSNMA Alert Message events. Improved the management of OSNMA
  cryptographic material and added unit tests to ensure compliance with the
  OSNMA Receiver Guidelines v1.3, including edge-case handling. Added the new
  configuration value `GNSS-SDR.osnma_mode=replay`, which disables the receiver
  wall-clock GST alignment check for OSNMA tag processing, enabling replay of
  previously captured Galileo signals while keeping all other OSNMA verification
  steps active.
- Fixed the decimation logic of the `Monitor`, `AcquisitionMonitor` and
  `TrackingMonitor` blocks: `decimation_factor` now selects every N-th epoch and
  always consumes all the input items, instead of grouping `Gnss_Synchro`
  objects into bursts and skipping others, and empty datagrams are no longer
  sent. Fixed a use-after-free memory corruption caused by
  `google::protobuf::ShutdownProtobufLibrary()` being called from the destructor
  of `Serdes_Gnss_Synchro`, before the protobuf library was actually used; the
  library is now shut down only once, at program exit. Added a unit test for the
  monitor decimation. Contributed by
  [@vladisslav2011](https://github.com/vladisslav2011).
- `GPS_L1_CA_DLL_PLL_Tracking_GPU`: fixed a cross-block data race in the CUDA
  multi-correlator kernel (the carrier wipe-off and the correlation were in the
  same launch, synchronized only with `__syncthreads()`), fixed the
  `cudaHostAlloc` flags (`cudaHostAllocMapped || cudaHostAllocWriteCombined`
  evaluated to `cudaHostAllocPortable`), stopped calling `cudaDeviceReset()`
  from a per-channel destructor (it tore down the context under the other
  channels), and stopped `cudaFree()`-ing device aliases of host-mapped buffers.

## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

- The PVT Monitor now reports per-signal details for satellites used in the
  position solution, including PRN, constellation, signal, azimuth, elevation,
  and whether multiple signals were combined. Contributed by
  [@joebre](https://github.com/joebre).
- The Monitor (`Monitor.enable_monitor=true`) now also reports channels that are
  tracking a signal but do not have a valid time reference yet, filling their
  entries with the latest raw tracking data (C/N0, Doppler, carrier phase) while
  keeping their observable validity flags unset. This makes the Monitor usable
  in Galileo E6-only configurations, where the time of week cannot be obtained
  from HAS pages, as well as during the initial seconds of operation, before the
  telemetry decoders attain synchronization.
- Added Galileo System Time (GST) annotations to HAS outputs when GST is decoded
  from an I/NAV channel, enabling the HAS Time of Hour (TOH) to be associated
  with an absolute UTC timestamp.
- Galileo E6 observables are now generated by default, making them available in
  RINEX files and other receiver outputs when E6 channels are configured. Since
  Galileo E6 HAS pages do not broadcast the time of week, the receiver
  configuration must also include other Galileo channels providing the time
  reference for the E6 observables, either E1 or E5b (I/NAV), or E5a (F/NAV).
  Their generation can be disabled by setting `Observables.enable_E6=false`.
  This setting is now independent of `PVT.use_e6_for_pvt`, which keeps
  controlling whether E6 observables are used in the PVT solution.
- The console now reports the RTKLIB solution status. The `First position fix`
  and periodic `Position at` lines are tagged with `[RTK FIXED]`, `[RTK FLOAT]`,
  `[DGNSS]`, `[SBAS]` or `[PPP]` (color-coded), and status transitions are
  announced once when they happen, including the LAMBDA ambiguity-resolution
  ratio and its threshold when an RTK fix is acquired or lost. The `[PPP]` label
  is only shown when precise ephemeris and clock products are actually loaded;
  PPP-mode processing on broadcast products is not labeled as PPP. Plain
  single-point operation keeps the classic, unmodified console output. The
  underlying outputs (PVT dump, Monitor, NMEA) keep reporting the raw RTKLIB
  solution status.
- A new global parameter `GNSS-SDR.observation_date` allows specifying the
  approximate date of the signal capture, in `YYYY-MM-DD` or `YYYY` format
  (e.g., `GNSS-SDR.observation_date=2014-12-20`), when post-processing recorded
  signal files. It is used to resolve the GPS mod-1024 week-number rollover:
  each broadcast week number is expanded to the 1024-week era closest to the
  given date. This works for recordings from any era, including files captured
  after the April 2019 rollover replayed far in the future, and also fixes the
  applied leap-second offset, which is derived from the resolved date. If the
  parameter is not set, the era is derived from the system clock, as before,
  which is the right choice for live operation. The `GNSS-SDR.pre_2009_file`
  flag, which could only select the August 1999 - April 2019 era, is now
  deprecated: it keeps working exactly as before, but the receiver prints a
  notice suggesting `GNSS-SDR.observation_date` instead, and it is ignored if
  the new parameter is also set.
- Reworked the Python plotting utilities under `utils/python` (acquisition,
  tracking, telemetry, observables, and PVT diagnostics). Each script now
  exposes a command-line interface (run with `--help`) and can be executed from
  any directory with configurable input and output locations, instead of
  requiring edits to the source to change file paths. The `--file-prefix` option
  takes the value of the corresponding block's `dump_filename` configuration
  parameter directly, reconstructing the dump file names the same way the
  receiver does. A new `utils/python/README.md` documents all the utilities and
  their options. Includes fixes to the acquisition grid and tracking dump
  readers and plotters contributed by [@minhaj6](https://github.com/minhaj6).
- Fixed the time tags of position solutions reported in the terminal and in
  NMEA, KML, GPX, and GeoJSON outputs for configurations without GPS channels
  (e.g., Galileo-only receivers): the reported epoch was shifted by the residual
  receiver clock offset, which in the absence of GPS satellites is absorbed by
  an inter-system bias state instead of the receiver clock state. Reported
  epochs now fall on the same integer-millisecond grid as the observables, as
  they already did in configurations including GPS. RINEX files were not
  affected.
- Abseil logging now creates a unique timestamp/PID logfile for each run,
  preserving previous logs across the receiver, calibration tool, and test
  runners. On POSIX systems, an atomically updated relative symlink points to
  the latest logfile.

-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.22) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23182959.svg)](https://doi.org/10.5281/zenodo.23182959)
