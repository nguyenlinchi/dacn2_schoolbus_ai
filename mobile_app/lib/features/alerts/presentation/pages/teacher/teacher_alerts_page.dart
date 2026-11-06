
import 'package:flutter/material.dart';

class TeacherAlertsPage extends StatefulWidget {
  const TeacherAlertsPage({super.key});

  @override
  State<TeacherAlertsPage> createState() => _TeacherAlertsPageState();
}

class _TeacherAlertsPageState extends State<TeacherAlertsPage> {
  final List<Map<String, dynamic>> alerts = [
    {
      'title': 'Học sinh chưa được điểm danh',
      'description': 'Nguyễn Hoàng Nam - Tuyến 05',
      'time': '07:05',
      'type': 'attendance',
      'resolved': false,
    },
    {
      'title': 'Cảnh báo phát hiện người trên xe',
      'description': 'Phát hiện chuyển động sau khi kết thúc chuyến',
      'time': '07:30',
      'type': 'safety',
      'resolved': false,
    },
    {
      'title': 'Yêu cầu hỗ trợ SOS',
      'description': 'Có yêu cầu hỗ trợ từ chuyến xe',
      'time': '08:00',
      'type': 'sos',
      'resolved': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final pendingCount =
        alerts.where((item) => item['resolved'] == false).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Cảnh báo & SOS',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSummary(pendingCount),
          const SizedBox(height: 20),

          const Text(
            'Danh sách cảnh báo',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 12),

          ...List.generate(
            alerts.length,
            (index) => _buildAlertCard(index),
          ),
        ],
      ),
    );
  }

  Widget _buildSummary(int pendingCount) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.red.shade100),
      ),
      child: Row(
        children: [
          Icon(
            Icons.warning_amber_rounded,
            size: 40,
            color: Colors.red.shade700,
          ),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '$pendingCount cảnh báo chưa xử lý',
                style: TextStyle(
                  color: Colors.red.shade800,
                  fontWeight: FontWeight.bold,
                  fontSize: 17,
                ),
              ),
              const SizedBox(height: 4),
              const Text('Vui lòng kiểm tra các cảnh báo mới.'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAlertCard(int index) {
    final alert = alerts[index];
    final bool resolved = alert['resolved'] as bool;
    final String type = alert['type'] as String;

    final IconData icon;
    final Color color;

    switch (type) {
      case 'sos':
        icon = Icons.sos;
        color = Colors.red;
        break;
      case 'safety':
        icon = Icons.directions_bus;
        color = Colors.orange;
        break;
      default:
        icon = Icons.person_search;
        color = Colors.blue;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  backgroundColor: color.withValues(alpha: 0.12),
                  child: Icon(icon, color: color),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        alert['title'],
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        alert['description'],
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 7),
                      Text(
                        'Thời gian: ${alert['time']}',
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            Align(
              alignment: Alignment.centerRight,
              child: resolved
                  ? const Chip(
                      label: Text('Đã xử lý'),
                      avatar: Icon(
                        Icons.check_circle,
                        color: Colors.green,
                        size: 18,
                      ),
                    )
                  : TextButton.icon(
                      onPressed: () => _resolveAlert(index),
                      icon: const Icon(Icons.check),
                      label: const Text('Xác nhận xử lý'),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  void _resolveAlert(int index) {
    setState(() {
      alerts[index]['resolved'] = true;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đã xử lý cảnh báo mẫu'),
      ),
    );
  }
}
