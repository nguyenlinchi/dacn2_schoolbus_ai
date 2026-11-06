
import 'package:flutter/material.dart';

import 'package:mobile_app/features/authentication/domain/entities/app_user.dart';

import '../pages/teacher_home_page.dart';
import '../widgets/teacher_bottom_navigation.dart';

// TODO: Điều chỉnh các đường dẫn này cho khớp với file thực tế trong project.
import 'package:mobile_app/features/trips/presentation/pages/teacher/teacher_route_page.dart';
import 'package:mobile_app/features/attendance/presentation/pages/teacher/teacher_attendance_page.dart';
import 'package:mobile_app/features/alerts/presentation/pages/teacher/teacher_alerts_page.dart';
import 'package:mobile_app/features/profile/presentation/pages/teacher/teacher_profile_page.dart';

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
      TeacherHomePage(user: widget.user),
      const TeacherRoutePage(),
      const TeacherAttendancePage(),
      const TeacherAlertsPage(),
      TeacherProfilePage(user: widget.user),
    ];
  }

  void _onTabSelected(int index) {
    if (index < 0 || index >= _pages.length) return;

    setState(() {
      _currentIndex = index;
    });
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
        onTap: _onTabSelected,
      ),
    );
  }
}