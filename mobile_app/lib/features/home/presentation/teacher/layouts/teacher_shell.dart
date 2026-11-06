import 'package:flutter/material.dart';

import '../../../../authentication/domain/entities/app_user.dart';

import '../widgets/teacher_bottom_navigation.dart';

// Các màn hình chức năng
import '../../../trips/presentation/pages/teacher_trips_page.dart';
import '../../../trips/presentation/pages/teacher_route_page.dart';
import '../../../attendance/presentation/pages/attendance_page.dart';
import '../../../alerts/presentation/pages/teacher_alerts_page.dart';
import '../../../authentication/presentation/pages/teacher_profile_page.dart';

class TeacherShell extends StatefulWidget {
  final AppUser user;

  const TeacherShell({
    super.key,
    required this.user,
  });

  @override
  State<TeacherShell> createState() => _TeacherShellState();
}

class _TeacherShellState extends State<TeacherShell> {
  int _currentIndex = 0;

  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();

    _pages = [
      TeacherTripsPage(user: widget.user),
      const TeacherRoutePage(),
      const AttendancePage(),
      const TeacherAlertsPage(),
      TeacherProfilePage(user: widget.user),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),

      bottomNavigationBar: TeacherBottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}