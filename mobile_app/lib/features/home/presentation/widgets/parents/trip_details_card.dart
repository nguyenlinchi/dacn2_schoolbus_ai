import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_app/features/home/data/models/parent_models.dart';
import 'package:mobile_app/features/home/presentation/pages/parent/home_theme.dart';
import 'package:mobile_app/features/home/presentation/widgets/parents/home_widgets.dart';

/// Danh sách chi tiết chuyến: xe, tuyến, điểm đón, điểm trả, giờ chạy.
class TripDetailsCard extends StatelessWidget {
  const TripDetailsCard({super.key, required this.trip});
  final TodayTrip trip;

  @override
  Widget build(BuildContext context) {
    final hm = DateFormat('HH:mm');
    final rows = <({IconData icon, String label, String value})>[
      (
        icon: Icons.directions_bus_outlined,
        label: 'Xe',
        value: '${trip.licensePlate} · ${trip.busCode}',
      ),
      if (trip.routeCode != null)
        (
          icon: Icons.alt_route_rounded,
          label: 'Tuyến',
          value: trip.routeName == null
              ? trip.routeCode!
              : '${trip.routeCode} · ${trip.routeName}',
        ),
      (
        icon: Icons.location_on_outlined,
        label: 'Điểm đón',
        value: trip.pickupEstimatedTime == null
            ? trip.pickupStopName
            : '${trip.pickupStopName} · dự kiến ${trip.pickupEstimatedTime}',
      ),
      (
        icon: Icons.flag_outlined,
        label: 'Điểm trả',
        value: trip.dropoffEstimatedTime == null
            ? trip.dropoffStopName
            : '${trip.dropoffStopName} · dự kiến ${trip.dropoffEstimatedTime}',
      ),
      (
        icon: Icons.schedule_rounded,
        label: 'Giờ chạy',
        value: '${hm.format(trip.startAt)} - ${hm.format(trip.endAt)}',
      ),
    ];

    return Column(
      children: [
        for (var i = 0; i < rows.length; i++) ...[
          if (i > 0) const Divider(height: 22, color: HomeColors.greySoft),
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: HomeColors.blueSoft,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(rows[i].icon, size: 18, color: HomeColors.primary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(rows[i].label, style: homeText(12, FontWeight.w400, HomeColors.muted)),
                    Text(rows[i].value, style: homeText(14, FontWeight.w600, HomeColors.ink)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

/// Thẻ "Chuyến gần nhất" cho chuyến đã hoàn tất.
class LatestTripCard extends StatelessWidget {
  const LatestTripCard({super.key, required this.trip});
  final TodayTrip trip;

  @override
  Widget build(BuildContext context) {
    final hm = DateFormat('HH:mm');
    final checkIn = trip.checkInTime != null ? hm.format(trip.checkInTime!) : '--';
    final checkOut = trip.checkOutTime != null ? hm.format(trip.checkOutTime!) : '--';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const HomeSectionTitle('Chuyến gần nhất'),
        HomeCard(
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${trip.tripTypeLabel} · ${DateFormat('dd/MM').format(trip.startAt)}',
                      style: homeText(15, FontWeight.w700, HomeColors.ink),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Lên xe $checkIn · Xuống xe $checkOut',
                      style: homeText(13, FontWeight.w400, HomeColors.muted),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: HomeColors.greenSoft,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'Hoàn tất',
                  style: homeText(12, FontWeight.w600, HomeColors.greenText),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}